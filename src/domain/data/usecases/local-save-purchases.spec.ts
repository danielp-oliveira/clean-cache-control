class LocalSavePurchases {
  constructor (private readonly cacheStore: CacheStore) { }

  async save (): Promise<void> {
    this.cacheStore.delete()
  }
}

interface CacheStore {
  delete: () => void
}

class CacheStoreSpy implements CacheStore {
  deleteCallsCount = 0

  delete (): void {
    this.deleteCallsCount++
  }
}

describe('LocalSavePurchases', () => {
  test('Should not delete cache on sut.init', () => {
    const cacheStoreSpy = new CacheStoreSpy()
    new LocalSavePurchases(cacheStoreSpy)
    expect(cacheStoreSpy.deleteCallsCount).toBe(0)
  })

  test('Should delete old cache on sut.save', async () => {
    const cacheStoreSpy = new CacheStoreSpy()
    const sut = new LocalSavePurchases(cacheStoreSpy)
    await sut.save()
    expect(cacheStoreSpy.deleteCallsCount).toBe(1)
  })
})