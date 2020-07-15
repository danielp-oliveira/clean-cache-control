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

type SutTypes = {
  sut: LocalSavePurchases
  cacheStoreSpy: CacheStoreSpy
}

const makeSut = (): SutTypes => {
  const cacheStoreSpy = new CacheStoreSpy()
  const sut = new LocalSavePurchases(cacheStoreSpy)
  return {
    sut,
    cacheStoreSpy
  }
}

describe('LocalSavePurchases', () => {
  test('Should not delete cache on sut.init', () => {
    const { cacheStoreSpy } = makeSut()
    expect(cacheStoreSpy.deleteCallsCount).toBe(0)
  })

  test('Should delete old cache on sut.save', async () => {
    const { sut, cacheStoreSpy } = makeSut()
    await sut.save()
    expect(cacheStoreSpy.deleteCallsCount).toBe(1)
  })
})