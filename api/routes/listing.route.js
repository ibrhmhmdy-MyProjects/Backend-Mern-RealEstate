import express from 'express'
import { createListing, deleteListing, getListing, getListings, updateListing } from '../controllers/listing.controller.js'
import { AuthToken } from '../utils/Auth.js'

const router = express.Router()

router.post('/create', AuthToken, createListing)
router.delete('/delete/:id', AuthToken, deleteListing)
router.post('/update/:id', AuthToken, updateListing)
router.get('/get/:id', getListing)
router.get('/get', getListings)
export default router