class LocalSavePurchases {
  constructor (private readonly cacheStore: CacheStore) { }
}

interface CacheStore {
}

class CacheStoreSpy implements CacheStore {
  deleteCallsCount = 0
}

describe('LocalSavePurchases', () => {
  test('Should not delete cache on sut.init', () => {
    const cacheStoreSpy = new CacheStoreSpy()
    const sut = new LocalSavePurchases(cacheStoreSpy)
    expect(cacheStoreSpy.deleteCallsCount).toBe(0)
  })
})