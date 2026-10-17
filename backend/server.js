const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite', // Saves database records cleanly inside a local folder file
  logging: false
});

// Admin User Profile Model Schema Mapping
const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false }
});

// Department Model Schema Mapping
const Department = sequelize.define('Department', {
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  status: { type: DataTypes.STRING, defaultValue: 'Active' }
});

// Asset Category Model Schema Mapping
const AssetCategory = sequelize.define('AssetCategory', {
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  customFields: { type: DataTypes.TEXT }
});

// Asset Registry Model Schema Mapping
const Asset = sequelize.define('Asset', {
  assetTag: { type: DataTypes.STRING, allowNull: false, unique: true },
  serialNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
  name: { type: DataTypes.STRING, allowNull: false },
  acquisitionDate: { type: DataTypes.DATEONLY },
  acquisitionCost: { type: DataTypes.FLOAT },
  condition: { type: DataTypes.STRING, defaultValue: 'Good' },
  location: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, defaultValue: 'Available' },
  isBookable: { type: DataTypes.BOOLEAN, defaultValue: false }
});

// Asset Allocation & Transfer Model
const Allocation = sequelize.define('Allocation', {
  expectedReturnDate: { type: DataTypes.DATEONLY },
  actualReturnDate: { type: DataTypes.DATEONLY },
  status: { type: DataTypes.STRING, defaultValue: 'Active' },
  conditionCheckNotes: { type: DataTypes.TEXT }
});

// Resource Booking Model
const Booking = sequelize.define('Booking', {
  startTime: { type: DataTypes.DATE, allowNull: false },
  endTime: { type: DataTypes.DATE, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'Upcoming' }
});

// Maintenance Request Model
const Maintenance = sequelize.define('Maintenance', {
  description: { type: DataTypes.TEXT, allowNull: false },
  priority: { type: DataTypes.STRING, defaultValue: 'Medium' },
  status: { type: DataTypes.STRING, defaultValue: 'Pending' },
  assignedTechnician: { type: DataTypes.STRING }
});

// Audit Cycle Model
const AuditCycle = sequelize.define('AuditCycle', {
  scope: { type: DataTypes.STRING, allowNull: false },
  startDate: { type: DataTypes.DATEONLY, allowNull: false },
  endDate: { type: DataTypes.DATEONLY, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'Open' }
});

// Audit Item Verification Model
const AuditItem = sequelize.define('AuditItem', {
  status: { type: DataTypes.STRING, defaultValue: 'Pending' },
  discrepancyNotes: { type: DataTypes.TEXT }
});

// Activity Log & Notification Model
const ActivityLog = sequelize.define('ActivityLog', {
  action: { type: DataTypes.STRING, allowNull: false },
  details: { type: DataTypes.TEXT },
  severity: { type: DataTypes.STRING, defaultValue: 'Info' }
});

// Define Relationships (Associations)
User.belongsTo(Department, { foreignKey: 'departmentId' });
Department.hasMany(User, { foreignKey: 'departmentId' });

Department.belongsTo(Department, { as: 'ParentDepartment', foreignKey: 'parentDepartmentId' });

Asset.belongsTo(AssetCategory, { foreignKey: 'categoryId' });
AssetCategory.hasMany(Asset, { foreignKey: 'categoryId' });

Asset.belongsTo(Department, { foreignKey: 'departmentId' });
Department.hasMany(Asset, { foreignKey: 'departmentId' });

Allocation.belongsTo(Asset, { foreignKey: 'assetId' });
Allocation.belongsTo(User, { foreignKey: 'userId' });

Booking.belongsTo(Asset, { foreignKey: 'assetId' });
Booking.belongsTo(User, { foreignKey: 'userId' });

Maintenance.belongsTo(Asset, { foreignKey: 'assetId' });
Maintenance.belongsTo(User, { as: 'RaisedBy', foreignKey: 'raisedByUserId' });

AuditCycle.belongsTo(User, { as: 'Auditor', foreignKey: 'auditorId' });
AuditItem.belongsTo(AuditCycle, { foreignKey: 'auditCycleId' });
AuditItem.belongsTo(Asset, { foreignKey: 'assetId' });
AuditCycle.hasMany(AuditItem, { foreignKey: 'auditCycleId' });

ActivityLog.belongsTo(User, { foreignKey: 'userId' });

// Registration Endpoint Gateway
app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ message: 'All fields are required.' });
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await User.create({ username, email, password: hashedPassword });
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    res.status(400).json({ message: 'Username or email already exists.' });
  }
});

// Login Verification Endpoint Gateway
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Invalid credentials.' });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials.' });
    
    const token = jwt.sign({ id: user.id }, 'secret_key', { expiresIn: '1d' });
    
    res.json({ 
      token, 
      user: { id: user.id, username: user.username, email: user.email } 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// ORGANIZATION SETUP API ROUTES
// ==========================================

app.get('/api/departments', async (req, res) => {
  try {
    const departments = await Department.findAll({ include: [{ model: Department, as: 'ParentDepartment' }] });
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/departments', async (req, res) => {
  const { name, parentDepartmentId } = req.body;
  if (!name) return res.status(400).json({ message: 'Department name is required.' });
  try {
    const department = await Department.create({ name, parentDepartmentId });
    res.status(201).json(department);
  } catch (err) {
    res.status(400).json({ message: 'Department already exists or invalid parent.' });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const categories = await AssetCategory.findAll();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/categories', async (req, res) => {
  const { name, customFields } = req.body;
  if (!name) return res.status(400).json({ message: 'Category name is required.' });
  try {
    const category = await AssetCategory.create({ name, customFields });
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ message: 'Category already exists.' });
  }
});

app.get('/api/employees', async (req, res) => {
  try {
    const employees = await User.findAll({ attributes: { exclude: ['password'] }, include: [Department] });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// ASSET REGISTRATION & DIRECTORY API ROUTES
// ==========================================

app.get('/api/assets', async (req, res) => {
  try {
    const { categoryId, status, departmentId } = req.query;
    let whereClause = {};

    if (status) whereClause.status = status;
    if (categoryId) whereClause.categoryId = categoryId;
    if (departmentId) whereClause.departmentId = departmentId;

    const assets = await Asset.findAll({
      where: whereClause,
      include: [AssetCategory, Department]
    });
    res.json(assets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/assets', async (req, res) => {
  const { name, categoryId, departmentId, serialNumber, acquisitionDate, acquisitionCost, condition, location, isBookable } = req.body;
  
  if (!name || !categoryId || !serialNumber) {
    return res.status(400).json({ message: 'Name, Category, and Serial Number are required.' });
  }

  try {
    const count = await Asset.count();
    const assetTag = `AF-${String(count + 1).padStart(4, '0')}`;

    const asset = await Asset.create({
      assetTag,
      name,
      categoryId,
      departmentId,
      serialNumber,
      acquisitionDate,
      acquisitionCost,
      condition: condition || 'Good',
      location,
      isBookable: isBookable || false,
      status: 'Available'
    });

    res.status(201).json(asset);
  } catch (err) {
    res.status(400).json({ message: 'Serial number or asset tag already exists.' });
  }
});

app.patch('/api/assets/:id/status', async (req, res) => {
  const { status, condition } = req.body;
  try {
    const asset = await Asset.findByPk(req.params.id);
    if (!asset) return res.status(404).json({ message: 'Asset not found.' });

    if (status) asset.status = status;
    if (condition) asset.condition = condition;
    await asset.save();

    res.json({ message: 'Asset status updated successfully', asset });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// ASSET ALLOCATION & TRANSFER API ROUTES
// ==========================================

app.get('/api/allocations', async (req, res) => {
  try {
    const allocations = await Allocation.findAll({ include: [Asset, User] });
    res.json(allocations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/allocations', async (req, res) => {
  const { assetId, userId, expectedReturnDate } = req.body;

  if (!assetId || !userId) {
    return res.status(400).json({ message: 'Asset ID and User ID are required.' });
  }

  try {
    const asset = await Asset.findByPk(assetId);
    if (!asset) return res.status(404).json({ message: 'Asset not found.' });

    if (asset.status === 'Allocated') {
      const currentAllocation = await Allocation.findOne({
        where: { assetId, status: 'Active' },
        include: [User]
      });
      const holderName = currentAllocation && currentAllocation.User ? currentAllocation.User.username : 'another user';
      
      return res.status(400).json({ 
        message: `Conflict Error: This asset is currently held by ${holderName}. Please submit a Transfer Request instead.` 
      });
    }

    const allocation = await Allocation.create({
      assetId,
      userId,
      expectedReturnDate,
      status: 'Active'
    });

    asset.status = 'Allocated';
    await asset.save();

    res.status(201).json({ message: 'Asset allocated successfully!', allocation });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/allocations/:id/return', async (req, res) => {
  const { conditionCheckNotes, newCondition } = req.body;
  try {
    const allocation = await Allocation.findByPk(req.params.id, { include: [Asset] });
    if (!allocation || allocation.status !== 'Active') {
      return res.status(404).json({ message: 'Active allocation not found.' });
    }

    allocation.status = 'Returned';
    allocation.actualReturnDate = new Date();
    allocation.conditionCheckNotes = conditionCheckNotes;
    await allocation.save();

    const asset = allocation.Asset;
    if (asset) {
      asset.status = 'Available';
      if (newCondition) asset.condition = newCondition;
      await asset.save();
    }

    res.json({ message: 'Asset returned successfully and status reverted to Available.', allocation });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// RESOURCE BOOKING API ROUTES
// ==========================================

app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.findAll({ include: [Asset, User] });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/bookings', async (req, res) => {
  const { assetId, userId, startTime, endTime } = req.body;

  if (!assetId || !userId || !startTime || !endTime) {
    return res.status(400).json({ message: 'All booking fields are required.' });
  }

  try {
    const asset = await Asset.findByPk(assetId);
    if (!asset || !asset.isBookable) {
      return res.status(400).json({ message: 'Selected asset is not bookable or does not exist.' });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) {
      return res.status(400).json({ message: 'Start time must be before end time.' });
    }

    const existingBookings = await Booking.findAll({
      where: {
        assetId,
        status: { [Sequelize.Op.not]: 'Cancelled' }
      }
    });

    for (const booking of existingBookings) {
      const bStart = new Date(booking.startTime);
      const bEnd = new Date(booking.endTime);

      if (start < bEnd && end > bStart) {
        return res.status(400).json({ 
          message: `Overlap Conflict: This resource is already booked from ${bStart.toLocaleString()} to ${bEnd.toLocaleString()}.` 
        });
      }
    }

    const newBooking = await Booking.create({
      assetId,
      userId,
      startTime: start,
      endTime: end,
      status: 'Upcoming'
    });

    res.status(201).json({ message: 'Resource booked successfully!', newBooking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.patch('/api/bookings/:id/cancel', async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });

    booking.status = 'Cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully.', booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// MAINTENANCE MANAGEMENT API ROUTES
// ==========================================

app.get('/api/maintenance', async (req, res) => {
  try {
    const maintenanceRequests = await Maintenance.findAll({ include: [Asset, { model: User, as: 'RaisedBy' }] });
    res.json(maintenanceRequests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/maintenance', async (req, res) => {
  const { assetId, raisedByUserId, description, priority } = req.body;

  if (!assetId || !raisedByUserId || !description) {
    return res.status(400).json({ message: 'Asset, user, and description are required.' });
  }

  try {
    const asset = await Asset.findByPk(assetId);
    if (!asset) return res.status(404).json({ message: 'Asset not found.' });

    const maintenance = await Maintenance.create({
      assetId,
      raisedByUserId,
      description,
      priority: priority || 'Medium',
      status: 'Pending'
    });

    res.status(201).json({ message: 'Maintenance request raised successfully!', maintenance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.patch('/api/maintenance/:id/status', async (req, res) => {
  const { status, assignedTechnician } = req.body;

  try {
    const maintenance = await Maintenance.findByPk(req.params.id, { include: [Asset] });
    if (!maintenance) return res.status(404).json({ message: 'Maintenance request not found.' });

    if (status) maintenance.status = status;
    if (assignedTechnician) maintenance.assignedTechnician = assignedTechnician;
    await maintenance.save();

    const asset = maintenance.Asset;
    if (asset) {
      if (status === 'Approved' || status === 'In Progress') {
        asset.status = 'Under Maintenance';
        await asset.save();
      } else if (status === 'Resolved') {
        asset.status = 'Available';
        await asset.save();
      }
    }

    res.json({ message: 'Maintenance status updated successfully.', maintenance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// ASSET AUDIT SYSTEM API ROUTES
// ==========================================

app.get('/api/audits', async (req, res) => {
  try {
    const audits = await AuditCycle.findAll({ include: [{ model: User, as: 'Auditor' }] });
    res.json(audits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/audits', async (req, res) => {
  const { scope, startDate, endDate, auditorId } = req.body;
  if (!scope || !startDate || !endDate) {
    return res.status(400).json({ message: 'Scope, start date, and end date are required.' });
  }
  try {
    const auditCycle = await AuditCycle.create({ scope, startDate, endDate, auditorId, status: 'Open' });
    const assets = await Asset.findAll();
    for (const asset of assets) {
      await AuditItem.create({ auditCycleId: auditCycle.id, assetId: asset.id, status: 'Pending' });
    }
    res.status(201).json({ message: 'Audit cycle created successfully!', auditCycle });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/audits/:id/items', async (req, res) => {
  try {
    const items = await AuditItem.findAll({ where: { auditCycleId: req.params.id }, include: [Asset] });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.patch('/api/audit-items/:id', async (req, res) => {
  const { status, discrepancyNotes } = req.body;
  try {
    const item = await AuditItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Audit item not found.' });
    if (status) item.status = status;
    if (discrepancyNotes) item.discrepancyNotes = discrepancyNotes;
    await item.save();
    res.json({ message: 'Item verification updated.', item });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.patch('/api/audits/:id/close', async (req, res) => {
  try {
    const auditCycle = await AuditCycle.findByPk(req.params.id);
    if (!auditCycle) return res.status(404).json({ message: 'Audit cycle not found.' });
    auditCycle.status = 'Closed';
    await auditCycle.save();

    const items = await AuditItem.findAll({ where: { auditCycleId: auditCycle.id }, include: [Asset] });
    for (const item of items) {
      if (item.Asset) {
        if (item.status === 'Missing') {
          item.Asset.status = 'Lost';
          await item.Asset.save();
        } else if (item.status === 'Damaged') {
          item.Asset.condition = 'Damaged';
          await item.Asset.save();
        }
      }
    }
    res.json({ message: 'Audit cycle closed and discrepancy statuses updated.', auditCycle });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// REPORTS, ANALYTICS & NOTIFICATIONS API ROUTES
// ==========================================

app.get('/api/reports/analytics', async (req, res) => {
  try {
    const totalAssets = await Asset.count();
    const allocatedAssets = await Asset.count({ where: { status: 'Allocated' } });
    const availableAssets = await Asset.count({ where: { status: 'Available' } });
    const underMaintenance = await Asset.count({ where: { status: 'Under Maintenance' } });
    const lostAssets = await Asset.count({ where: { status: 'Lost' } });

    const utilizationRate = totalAssets > 0 ? ((allocatedAssets / totalAssets) * 100).toFixed(2) : 0;
    const maintenanceCounts = await Maintenance.count();

    res.json({
      summary: {
        totalAssets,
        allocatedAssets,
        availableAssets,
        underMaintenance,
        lostAssets,
        utilizationRate: `${utilizationRate}%`
      },
      maintenanceFrequencyTotal: maintenanceCounts
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/reports/logs', async (req, res) => {
  try {
    const logs = await ActivityLog.findAll({
      include: [User],
      order: [['createdAt', 'DESC']],
      limit: 50
    });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/reports/overdue-alerts', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const overdueAllocations = await Allocation.findAll({
      where: {
        status: 'Active',
        expectedReturnDate: { [Sequelize.Op.lt]: today }
      },
      include: [Asset, User]
    });

    res.json({
      count: overdueAllocations.length,
      overdueAllocations
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Dashboard Summary API Route
app.get('/api/dashboard/summary', async (req, res) => {
  try {
    const totalAssets = await Asset.count();
    const availableAssets = await Asset.count({ where: { status: 'Available' } });
    const allocatedAssets = await Asset.count({ where: { status: 'Allocated' } });
    const maintenanceToday = await Asset.count({ where: { status: 'Under Maintenance' } });
    const activeBookings = await Booking.count({ where: { status: 'Upcoming' } });
    const pendingMaintenance = await Maintenance.count({ where: { status: 'Pending' } });

    res.json({
      totalAssets,
      availableAssets,
      allocatedAssets,
      maintenanceToday,
      activeBookings,
      pendingMaintenance
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/', (req, res) => res.send('🚀 AssetFlow Server Running via Local Storage.'));

// Sync Database and Initialize Port Listening
sequelize.sync().then(() => {
  console.log('✅ SQLite database initialized and synced locally inside database.sqlite!');
  app.listen(PORT, () => console.log(`📡 Server actively monitoring port ${PORT}`));
}).catch(err => console.error('❌ Database Initialization Crash:', err));