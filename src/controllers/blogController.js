const authorModel = require("../models/authorModel.js")
const blogModel = require("../models/blogmodel.js")

const mongoose = require("mongoose")
//create blogs
const createBlogs = async function (req, res) {

    try {
        let validId = req["validToken"]["userId"]
        let blogData = req.body
        let authorId = req.body.authorId

        if (validId == authorId) {
            let blog = await authorModel.findById(authorId)
            if (blog) {
                let savedBlogs = await blogModel.create(blogData)
                res.status(201).send({ status: true, data: savedBlogs })
            } else {
                res.status(400).send({ status: false, msg: "invalid id" })
            }
        } else {
            res.status(401).send({ status: false, msg: "not authorised" })
        }
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message });

    }
}
//get blog
const getBlogs = async function (req, res) {
    try {
        let validId = req["validToken"]["userId"]

        const blogs = await blogModel.find({ isDeleted: false, isPublished: true })
        // console.log(blogs)
        let authorId = req.query.authorId
        let category = req.query.category
        let tags = req.query.tags
        let subcategory = req.query.subcategory
        if (validId == authorId) {
            if (blogs) {

                let check = await blogModel.find({ $or: [{ authorId: authorId }, { tags: [tags] }, { category: category }, { subcategory: [subcategory] }] });

                if (check) {
                    return res.status(200).send({ status: true, data: check })
                } else {
                    res.status(401).send({ status: false, msg: "invalid details" })
                }


            } else {
                res.status(400).send({ status: false, msg: "invalid blog" })
            }
        } else {
            res.status(401).send({ status: false, msg: "invalid id" })
        }
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message });

    }
}


// update blog

const updateBlog = async function (req, res) {
    try {
        let validId = req["validToken"]["userId"]
        const blogId = req.params.blogId
        let authorId = req.body.authorId
        let title = req.body.title
        let body = req.body.body
        let tags = req.body.tags
        let subcategory = req.body.subcategory
        if (validId == authorId) {
            const updatedBlog = await blogModel.findOneAndUpdate({ _id: blogId, isdeleted: false }, {
                title: title, body: body, isPublished: true, publishedAt: Date.now(),
                $push: { tags: tags }, $push: { subcategory: subcategory }
            }, { new: true })

            return res.status(200).send({ status: true, message: 'Blog updated successfully', data: updatedBlog });
        } else {
            return res.status(400).send({ status: false, msg: "invalid Id" })
        }
    } catch (err) {
        res.status(500).send({ status: false, message: err.message });

    }
}
//delete 
const checkdeletestatus = async function (req, res) {
    try {
        let validId = req["validToken"]["userId"]
        let blogId = req.params.blogId
        let authorId = req.query.authorId

        if (validId == authorId) {
            let deletedblogs = await blogModel.findOneAndUpdate({ _id: blogId, isDeleted: false }, { isDeleted: true, deletedAt: Date.now() })
            if (deletedblogs) {
                res.status(200).send({ status: true, msg: "successfully deleted" })
            }
            else {
                res.status(400).send({ status: false, msg: "invalid blogId" })
            }
        } else {
            res.status(403).send({ status: false, msg: "invalid Id" })
        }
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message });

    }
}
//delete by params
const deletebyparams = async function (req, res) {
    try {
        if (req["validToken"]["userId"] == req.query.authorId) {
            let updatedfilter = {}

            //console.log(updatedfilter)
            if (req.query.authorId) {
                updatedfilter["authorId"] = req.query.authorId
            }
            if (req.query.category) {
                updatedfilter["category"] = req.query.category
            }
            if (req.query.tags) {
                updatedfilter["tags"] = req.query.tags
            }
            if (req.query.subcategory) {
                updatedfilter["subcategory"] = req.query.subcategory
            }
            if (req.query.isPublished) {
                updatedfilter["isPublished"] = req.query.isPublished
            }
            //console.log(updatedfilter)

            let deleteData = await blogModel.findOne(updatedfilter)
            if (!deleteData) {
                return res.status(404).send({ status: false, msg: "Given data is Invalid" });
            }

            deleteData.isDeleted = true;
            deleteData.deletedAt = new Date()
            deleteData.save();

            res.status(200).send({ msg: "Succesful", data: deleteData });
        }
        else {
            res.status(404).send({ msg: "Invalid AuthorId" })
        }
    }
    catch (error) {
        res.status(500).send({ msg: error });
    }
}


module.exports.createBlogs = createBlogs;
module.exports.getBlogs = getBlogs;
module.exports.updateBlog = updateBlog;
module.exports.checkdeletestatus = checkdeletestatus;
module.exports.deletebyparams = deletebyparams