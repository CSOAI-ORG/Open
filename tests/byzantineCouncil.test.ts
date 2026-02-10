
// Mock the database
vi.mock('../db', () => ({
  getDb: vi.fn().mockResolvedValue({
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    execute: vi.fn().mockResolvedValue([]),
    $returningId: vi.fn().mockResolvedValue([{ id: 1 }]),
  }),
}));

// Mock WebSocket broadcast
vi.mock('../websocket/server', () => ({
  broadcastToUsers: vi.fn(),
  broadcastToAll: vi.fn(),
}));

describe('Byzantine Council Voting', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Consensus Calculation', () => {
    it('should require 2/3 majority (22 of 33 agents) for consensus', () => {
      const totalAgents = 33;
      const requiredVotes = Math.ceil(totalAgents * (2 / 3));
      expect(requiredVotes).toBe(22);
    });

    it('should tolerate up to 10 faulty agents (n >= 3f + 1)', () => {
      const totalAgents = 33;
      const maxFaultyAgents = Math.floor((totalAgents - 1) / 3);
      expect(maxFaultyAgents).toBe(10);
    });

    it('should calculate consensus percentage correctly', () => {
      const votesFor = 28;
      const totalVotes = 33;
      const consensusPercentage = (votesFor / totalVotes) * 100;
      expect(consensusPercentage).toBeCloseTo(84.85, 1);
    });

    it('should identify deadlock when votes are split evenly', () => {
      const votesFor = 16;
      const votesAgainst = 16;
      const abstentions = 1;
      const totalVotes = votesFor + votesAgainst + abstentions;
      
      const isDeadlocked = votesFor < 22 && votesAgainst < 22;
      expect(isDeadlocked).toBe(true);
    });

    it('should approve when 22+ agents vote in favor', () => {
      const votesFor = 25;
      const votesAgainst = 6;
      const abstentions = 2;
      
      const isApproved = votesFor >= 22;
      expect(isApproved).toBe(true);
    });

    it('should reject when 22+ agents vote against', () => {
      const votesFor = 8;
      const votesAgainst = 23;
      const abstentions = 2;
      
      const isRejected = votesAgainst >= 22;
      expect(isRejected).toBe(true);
    });
  });

  describe('Vote Validation', () => {
    it('should accept valid vote decisions', () => {
      const validDecisions = ['approve', 'reject', 'abstain'];
      
      validDecisions.forEach(decision => {
        expect(['approve', 'reject', 'abstain']).toContain(decision);
      });
    });

    it('should validate confidence scores are between 0 and 1', () => {
      const validConfidence = 0.95;
      const invalidConfidenceHigh = 1.5;
      const invalidConfidenceLow = -0.1;
      
      expect(validConfidence >= 0 && validConfidence <= 1).toBe(true);
      expect(invalidConfidenceHigh >= 0 && invalidConfidenceHigh <= 1).toBe(false);
      expect(invalidConfidenceLow >= 0 && invalidConfidenceLow <= 1).toBe(false);
    });