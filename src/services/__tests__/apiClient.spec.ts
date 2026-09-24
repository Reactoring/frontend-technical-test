/**
 * @jest-environment node
 */
import { z } from 'zod'
import { API_URL, ApiError, apiRequest } from '../apiClient'

const userSchema = z.object({ id: z.number(), nickname: z.string() })

const mockFetch = (response: Promise<Response>) => {
  global.fetch = jest.fn(() => response)
}

describe('apiRequest', () => {
  it('should return the validated data', async () => {
    mockFetch(Promise.resolve(Response.json({ id: 1, nickname: 'Thibaut' })))

    await expect(apiRequest('/user/1', { schema: userSchema })).resolves.toEqual({ id: 1, nickname: 'Thibaut' })
    expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/user/1`, expect.objectContaining({ method: 'GET' }))
  })

  it('should throw an ApiError with the status when the server fails', async () => {
    mockFetch(Promise.resolve(new Response(null, { status: 503 })))

    await expect(apiRequest('/user/1', { schema: userSchema })).rejects.toEqual(expect.objectContaining({ status: 503 }))
  })

  it('should throw an ApiError when the server is unreachable', async () => {
    mockFetch(Promise.reject(new TypeError('Failed to fetch')))

    await expect(apiRequest('/user/1', { schema: userSchema })).rejects.toBeInstanceOf(ApiError)
  })

  it('should throw an ApiError when the response does not match the schema', async () => {
    mockFetch(Promise.resolve(Response.json({ id: '1' })))

    await expect(apiRequest('/user/1', { schema: userSchema })).rejects.toThrow('Unexpected response from server')
  })
})
