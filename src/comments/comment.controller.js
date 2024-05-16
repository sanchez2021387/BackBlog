import { response, request } from "express";
import Publication from "../posts/publication.model.js";
import Comment from "./comment.model.js"

export const commentsPut = async (req, res) => {

    const { id } = req.params;
    const { _id, state, publicationId, ...resto} = req.body;

    await Comment.findByIdAndUpdate(id, resto);
    const comments = await Comment.findOne({_id: id});

    res.status(200).json({
        msg: 'Comment successfully updated',
        comments
    });
}

export const commentsPost = async (req, res) => {

    const { publicationId , comment, author } = req.body;

    try {

        const newComment = new Comment({ publicationId, comment, author });
        await newComment.save();

        const publication = await Publication.findById(publicationId);
        if (!publication) {
            return res.status(404).json({ message: 'Publication not found' });
        }

        publication.comments.push(newComment);
        await publication.save();

        res.status(201).json({ 
            newComment 
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating comment' });
    }
}


export const commentDelete = async (req, res) => {

    const { id } = req.params;
    
    await Comment.findByIdAndUpdate(id, { state: false });
    const comments = await Comment.findOne({ _id: id });

    res.status(200).json({
        msg: 'Comment successfully delete',
        comments
    });

}

export const commentsGet = async (req = request, res = response) => {

    const { limite, desde } = req.query;
    const query = { state: true };

    const [total, comments] = await Promise.all([
        Comment.countDocuments(query),
        Comment.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        comments
    });
}


export const getCommentById = async (req, res) => {

    const { id } = req.params;
    const comments = await Comment.findOne({_id: id});

    res.status(200).json({
        comments
    });
}

