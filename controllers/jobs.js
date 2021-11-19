const Job = require('../models/Job')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, NotFoundError} = require('../errors')

const getAllJobs = async (req, res) => {
    const jobs = await Job.find({createdBy: req.user.userID}).sort('createdAt')
    res.status(StatusCodes.OK).json({jobs, count: jobs.length})
}

const getSingleJob = async (req, res) => {
    const job = await Job.findOne({createdBy: req.user.userID, _id: req.params.id})

    if (!job) {
        throw new NotFoundError(`Not found job with id: ${req.params.id}`)
    }
    res.status(StatusCodes.OK).json({job})
}

const createJob = async (req, res) => {
    req.body.createdBy = req.user.userID
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({job})
}

const updateJob = async (req, res) => {
    const {
        body: {company, position},
        user: {userID},
        params: {id: jobID}
    } = req

    if (!company || !position) {
        throw new NotFoundError(`Please provide company and position`)
    }

    const job = await Job.findByIdAndUpdate({createdBy: userID, _id: jobID}, {company: company, position: position}, {new: true, runValidators: true})

    if (!job) {
        throw new NotFoundError(`Not found job with id: ${jobID}`)
    }
    
    res.status(StatusCodes.OK).json({msg: 'Job updated', job})
}

const deleteJob = async (req, res) => {
    const {id: jobID} = req.params
    const {userID} = req.user

    const job = await Job.findOneAndDelete({_id: jobID, createdBy: userID})

    if (!job) {
        throw new NotFoundError(`Not found job with id: ${jobID}`)
    }

    res.status(StatusCodes.OK).send()
}

module.exports = {
    getAllJobs,
    createJob,
    getSingleJob,
    updateJob,
    deleteJob
}