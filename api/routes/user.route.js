import express from 'express'
import { deleteUser, test, updateUser, getUserListing, getUserMessage } from '../controllers/user.controller.js'
import { AuthToken } from '../utils/Auth.js'

const router = express.Router()

router.get('/test', test)
router.post('/update/:id', AuthToken, updateUser)
router.delete('/delete/:id', AuthToken, deleteUser)
router.get('/listings/:id', AuthToken, getUserListing)
router.get('/:id', AuthToken, getUserMessage)

export default router