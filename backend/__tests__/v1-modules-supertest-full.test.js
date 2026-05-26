const request = require('supertest');
const app = require('../server');

const jwt = require('jsonwebtoken');
const models = require('../models');

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

jest.mock('../models', () => ({
  Usuario: {
    findByPk: jest.fn(),
  },
  Rol: {},

  // CRM
  CrmLead: {
    findAll: jest.fn(),
    stats: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
  },
  CrmInteraction: {
    findAll: jest.fn(),
    create: jest.fn(),
  },

  // Loyalty
  LoyaltyAccount: {
    findOrCreate: jest.fn(),
  },
  LoyaltyTransaction: {
    findAll: jest.fn(),
    create: jest.fn(),
  },

  // Marketing
  MarketingCampaign: {
    findAll: jest.fn(),
  },

  // Tracking
  PipelineStage: {
    findAll: jest.fn(),
  },
  ImportTracking: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    findOrCreate: jest.fn(),
    create: jest.fn(),
  },
  TrackingEvent: {
    findAll: jest.fn(),
    create: jest.fn(),
  },

  // Appointments
  Appointment: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
  },
  Branch: {},
  Auto: {},

  // Promotions
  Promotion: {
    findAll: jest.fn(),
  },
  PromotionVehicle: {},

  // TradeIn
  SaleRequest: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
  },
}));

const {
  Usuario,
  CrmLead,
  LoyaltyAccount,
  LoyaltyTransaction,
  PipelineStage,
  Appointment,
  Promotion,
  SaleRequest,
} = models;

describe('S5.1 API v1 módulos (Supertest)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Helpers
  const mockUser = (roleName, id = roleName === 'admin' ? 'uuid-admin-001' : 'uuid-client-001') => {
    Usuario.findByPk.mockResolvedValue({
      id,
      rol: { nombre: roleName },
    });
    jwt.verify.mockReturnValue({ id, email: 'mock@test.com' });
  };

  // ──────────────────────────────────────────────────────────────────────────
  describe('CRM', () => {
    test('CRM stats sin token → 401', async () => {
      const res = await request(app).get('/api/v1/crm/stats');
      expect(res.statusCode).toBe(401);
    });

    test('CRM stats admin → 200', async () => {
      mockUser('admin');
      CrmLead.findAll.mockResolvedValue([{ estado: 'pendiente', total: 3 }]);
      const res = await request(app).get('/api/v1/crm/stats').set('Cookie', 'token=token_mock');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  describe('Loyalty', () => {
    test('loyalty me sin token → 401', async () => {
      const res = await request(app).get('/api/v1/loyalty/me');
      expect(res.statusCode).toBe(401);
    });

    test('loyalty me client → 200', async () => {
      mockUser('client');
      LoyaltyAccount.findOrCreate.mockResolvedValue([{ id: 'acc1', puntos: 10 }, true]);
      LoyaltyTransaction.findAll.mockResolvedValue([{ id: 'tx1', puntos: 5 }]);

      const res = await request(app).get('/api/v1/loyalty/me').set('Cookie', 'token=token_mock');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('cuenta');
      expect(res.body).toHaveProperty('transacciones');
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  describe('Marketing', () => {
    test('marketing banners sin token → 200', async () => {
      const res = await request(app).get('/api/v1/marketing/banners');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success');
      expect(res.body.success).toBe(true);
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  describe('Tracking', () => {
    test('tracking stages sin token → 200', async () => {
      PipelineStage.findAll.mockResolvedValue([{ id: '1', step: 1, orden: 1 }]);
      const res = await request(app).get('/api/v1/tracking/stages');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  describe('Appointments', () => {
    test('appointments sin token → 401', async () => {
      const res = await request(app).get('/api/v1/appointments');
      expect(res.statusCode).toBe(401);
    });

    test('appointments client → 200', async () => {
      mockUser('client');
      Appointment.findAll.mockResolvedValue([{ id: 'CITA-1', estado: 'pendiente' }]);
      const res = await request(app).get('/api/v1/appointments').set('Cookie', 'token=token_mock');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  describe('Promotions', () => {
    test('promotions catalog sin token → 200', async () => {
      Promotion.findAll.mockResolvedValue([
        {
          id: 'p1',
          titulo: 'Promo 1',
          descuento_pct: 10,
          vehiculos: [{ id: 'a1' }, { id: 'a2' }],
        },
      ]);

      const res = await request(app).get('/api/v1/promotions/catalog');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('porVehiculo');
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  describe('TradeIn', () => {
    test('trade-in sin token → 401', async () => {
      const res = await request(app).get('/api/v1/trade-in');
      expect(res.statusCode).toBe(401);
    });

    test('trade-in POST sin marca/modelo → 400', async () => {
      mockUser('client');
      const res = await request(app).post('/api/v1/trade-in').set('Cookie', 'token=token_mock').send({});
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    test('trade-in DELETE id inexistente → 404', async () => {
      mockUser('admin');
      SaleRequest.findByPk.mockResolvedValue(null);
      const res = await request(app)
        .delete('/api/v1/trade-in/NO_EXISTE')
        .set('Cookie', 'token=token_mock');
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error', 'No encontrado');
    });

    test('trade-in list client → 200', async () => {
      mockUser('client');
      SaleRequest.findAll.mockResolvedValue([]);
      const res = await request(app).get('/api/v1/trade-in').set('Cookie', 'token=token_mock');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});

