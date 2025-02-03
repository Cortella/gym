import { STATUS_CODE } from '../../../utils/status-code'
import { app } from '../../../app'
import { prisma } from '../../../lib/prisma'
import { createAndAuthUser } from '../../../utils/test/create-and-auth-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Validate Check-in test (E2E)', (): void => {
  describe('when validating check-in', (): void => {
    beforeAll(async (): Promise<void> => {
      await app.ready()
    })

    afterAll(async (): Promise<void> => {
      await app.close()
    })

    it('should be able to validate a check-in', async (): Promise<void> => {
      const { token } = await createAndAuthUser(app)

      const user = await prisma.user.findFirstOrThrow()

      const gym = await prisma.gym.create({
        data: {
          title: 'JavaScript Gym',
          latitude: -27.2092052,
          longitude: -49.6401091,
        },
      })

      let checkIn = await prisma.checkIn.create({
        data: {
          gym_id: gym.id,
          user_id: user.id,
        },
      })

      const response = await request(app.server)
        .patch(`/check-ins/${checkIn.id}/validate`)
        .set('Authorization', `Bearer ${token}`)
        .send()

      expect(response.statusCode).toEqual(STATUS_CODE.NO_CONTENT)

      checkIn = await prisma.checkIn.findUniqueOrThrow({
        where: {
          id: checkIn.id,
        },
      })

      expect(checkIn.validated_at).toEqual(expect.any(Date))
    })
  })
})