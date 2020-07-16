import { LocalSavePurchases } from '@/data/usecases'
import { mockPurchases, CacheStoreSpy } from '@/data/tests'

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
  test('Should not delete or insert cache on sut.init', () => {
    const { cacheStoreSpy } = makeSut()
    expect(cacheStoreSpy.messages).toEqual([])
  })

  test('Should delete old cache on sut.save', async () => {
    const { sut, cacheStoreSpy } = makeSut()
    await sut.save(mockPurchases())
    expect(cacheStoreSpy.messages).toEqual([
      CacheStoreSpy.Message.delete,
      CacheStoreSpy.Message.insert
    ])
    expect(cacheStoreSpy.deleteKey).toBe('purchases')
  })

  test('Should not insert new Cache if delete fails', () => {
    const { sut, cacheStoreSpy } = makeSut()
    cacheStoreSpy.simulateDeleteError()
    const promise = sut.save(mockPurchases())
    expect(cacheStoreSpy.messages).toEqual([CacheStoreSpy.Message.delete])
    expect(promise).rejects.toThrow()
  })

  test('Should not insert new Cache if delete succeeds', async () => {
    const { sut, cacheStoreSpy } = makeSut()
    const purchases = mockPurchases()
    await sut.save(purchases)
    expect(cacheStoreSpy.messages).toEqual([
      CacheStoreSpy.Message.delete,
      CacheStoreSpy.Message.insert
    ])
    expect(cacheStoreSpy.insertKey).toBe('purchases')
    expect(cacheStoreSpy.insertValues).toEqual(purchases)
  })

  test('Should throw if insert throws', () => {
    const { sut, cacheStoreSpy } = makeSut()
    cacheStoreSpy.simulateInsertError()
    const promise = sut.save(mockPurchases())
    expect(cacheStoreSpy.messages).toEqual([
      CacheStoreSpy.Message.delete,
      CacheStoreSpy.Message.insert
    ])
    expect(promise).rejects.toThrow()
  })
})
