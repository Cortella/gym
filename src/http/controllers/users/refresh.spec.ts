import { app } from '../../../app'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Refresh Token test (E2E)', (): void => {
  describe('when generating new refresh token', (): void => {
    beforeAll(async (): Promise<void> => {
      await app.ready()
    })

    afterAll(async (): Promise<void> => {
      await app.close()
    })

    it('should be able to refresh a token', async (): Promise<void> => {
      await request(app.server).post('/users').send({
        name: 'Bruno',
        email: 'bnamchado10@gmail.com',
        password: '123456',
      })

      const authResponse = await request(app.server).post('/sessions').send({
        email: 'bnamchado10@gmail.com',
        password: '123456',
      })

      const cookies = authResponse.get('Set-Cookie') ?? []

      const response = await request(app.server)
        .patch('/token/refresh')
        .set('Cookie', cookies)
        .send()

      expect(response.statusCode).toEqual(200)
      expect(response.body).toEqual({
        token: expect.any(String),
      })
      expect(response.get('Set-Cookie')).toEqual([
        expect.stringContaining('refreshToken='),
      ])
    })
  })
})