import { SavePurchases } from '@/domain/usecases'
import { CacheStore } from '@/data/protocols/cache'
import { LocalSavePurchases } from '@/data/usecases'
import { mockPurchases } from '@/data/tests'

class CacheStoreSpy implements CacheStore {
  deleteCallsCount = 0
  insertCallsCount = 0
  deleteKey: string
  insertKey: string
  insertValues: Array<SavePurchases.Params> = []

  delete(key: string): void {
    this.deleteCallsCount++
    this.deleteKey = key
  }

  insert(key: string, value: any): void {
    this.insertCallsCount++
    this.insertKey = key
    this.insertValues = value
  }

  simulateDeleteError (): void {
    jest.spyOn(CacheStoreSpy.prototype, 'delete').mockImplementationOnce(() => {
      throw new Error()
    })
  }

  simulateInsertError (): void {
    jest.spyOn(CacheStoreSpy.prototype, 'insert').mockImplementationOnce(() => {
      throw new Error()
    })
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
    await sut.save(mockPurchases())
    expect(cacheStoreSpy.deleteCallsCount).toBe(1)
    expect(cacheStoreSpy.deleteKey).toBe('purchases')
  })

  test('Should not insert new Cache if delete fails', () => {
    const { sut, cacheStoreSpy } = makeSut()
    cacheStoreSpy.simulateDeleteError()
    const promise = sut.save(mockPurchases())
    expect(cacheStoreSpy.insertCallsCount).toBe(0)
    expect(promise).rejects.toThrow()
  })

  test('Should not insert new Cache if delete succeeds', async () => {
    const { sut, cacheStoreSpy } = makeSut()
    const purchases = mockPurchases()
    await sut.save(purchases)
    expect(cacheStoreSpy.deleteCallsCount).toBe(1)
    expect(cacheStoreSpy.insertCallsCount).toBe(1)
    expect(cacheStoreSpy.insertKey).toBe('purchases')
    expect(cacheStoreSpy.insertValues).toEqual(purchases)
  })

  test('Should throw if insert throws', () => {
    const { sut, cacheStoreSpy } = makeSut()
    cacheStoreSpy.simulateInsertError()
    const promise = sut.save(mockPurchases())
    expect(promise).rejects.toThrow()
  })
})
