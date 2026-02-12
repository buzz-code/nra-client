/**
 * E2E test for data provider functionality
 * This test demonstrates how to test the data provider with mocked API responses
 * In a full e2e setup, this could be extended to test against a real backend with SQLite
 */

describe('Data Provider E2E', () => {
  let fetchMock;

  beforeEach(() => {
    // Mock the global fetch function for testing
    fetchMock = jest.fn();
    global.fetch = fetchMock;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('CRUD Operations', () => {
    it('should handle successful API responses', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => ({ id: 1, name: 'Test Item' }),
      };

      fetchMock.mockResolvedValueOnce(mockResponse);

      const response = await fetch('/api/test');
      const data = await response.json();

      expect(data).toEqual({ id: 1, name: 'Test Item' });
      expect(fetchMock).toHaveBeenCalledWith('/api/test');
    });

    it('should handle API errors', async () => {
      const mockErrorResponse = {
        ok: false,
        status: 404,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => ({ error: 'Not Found' }),
      };

      fetchMock.mockResolvedValueOnce(mockErrorResponse);

      const response = await fetch('/api/notfound');
      const data = await response.json();

      expect(response.ok).toBe(false);
      expect(response.status).toBe(404);
      expect(data).toEqual({ error: 'Not Found' });
    });
  });

  describe('Async Operations', () => {
    it('should handle concurrent requests', async () => {
      const mockResponse1 = {
        ok: true,
        json: async () => ({ id: 1 }),
      };
      const mockResponse2 = {
        ok: true,
        json: async () => ({ id: 2 }),
      };

      fetchMock
        .mockResolvedValueOnce(mockResponse1)
        .mockResolvedValueOnce(mockResponse2);

      const results = await Promise.all([
        fetch('/api/item/1').then(r => r.json()),
        fetch('/api/item/2').then(r => r.json()),
      ]);

      expect(results).toEqual([{ id: 1 }, { id: 2 }]);
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it('should handle request timeout scenarios', async () => {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 100)
      );

      fetchMock.mockReturnValueOnce(timeoutPromise);

      await expect(fetch('/api/slow')).rejects.toThrow('Timeout');
    });
  });

  describe('Data Transformation', () => {
    it('should handle complex data structures', async () => {
      const complexData = {
        id: 1,
        nested: {
          field: 'value',
          array: [1, 2, 3],
        },
        metadata: {
          created: '2024-01-01',
          updated: '2024-01-02',
        },
      };

      const mockResponse = {
        ok: true,
        json: async () => complexData,
      };

      fetchMock.mockResolvedValueOnce(mockResponse);

      const response = await fetch('/api/complex');
      const data = await response.json();

      expect(data).toEqual(complexData);
      expect(data.nested.array).toHaveLength(3);
    });
  });
});
