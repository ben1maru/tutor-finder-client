import React, { useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    IconButton, Tooltip, Box, Button, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PropTypes from 'prop-types';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export const BlogManager = ({ posts, onSave, onDelete }) => {
    const [open, setOpen] = useState(false);
    const [currentPost, setCurrentPost] = useState(null);
    const [content, setContent] = useState('');

    const handleOpen = (post = null) => {
        if (post) {
            setCurrentPost(post);
            setContent(post.content || '');
        } else {
            setCurrentPost({ title: '', cover_image_url: '' });
            setContent('');
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentPost(null);
        setContent('');
    };

    const handleChange = (e) => {
        if (currentPost) {
            setCurrentPost({ ...currentPost, [e.target.name]: e.target.value });
        }
    };

    const handleSave = () => {
        if (currentPost) {
            onSave({ ...currentPost, content });
        }
        handleClose();
    };

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>Створити пост</Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ backgroundColor: 'action.hover' }}>
                        <TableRow>
                            <TableCell>Заголовок</TableCell>
                            <TableCell>Дата створення</TableCell>
                            <TableCell align="right">Дії</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.isArray(posts) && posts.map((post) => (
                            <TableRow key={post.id} hover>
                                <TableCell>{post.title}</TableCell>
                                <TableCell>{new Date(post.created_at).toLocaleDateString()}</TableCell>
                                <TableCell align="right">
                                    <Tooltip title="Редагувати"><IconButton onClick={() => handleOpen(post)} color="primary"><EditIcon /></IconButton></Tooltip>
                                    <Tooltip title="Видалити"><IconButton onClick={() => onDelete(post.id)} color="error"><DeleteIcon /></IconButton></Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
                <DialogTitle>{currentPost?.id ? 'Редагувати пост' : 'Створити новий пост'}</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" name="title" label="Заголовок" type="text" fullWidth variant="standard" value={currentPost?.title || ''} onChange={handleChange} sx={{ mb: 2 }} />
                    <TextField margin="dense" name="cover_image_url" label="URL головного зображення" type="url" fullWidth variant="standard" value={currentPost?.cover_image_url || ''} onChange={handleChange} sx={{ mb: 3 }} />
                    {open && (
                        <CKEditor
                            editor={ClassicEditor}
                            data={content}
                            onChange={(event, editor) => setContent(editor.getData())}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Скасувати</Button>
                    <Button onClick={handleSave} variant="contained">{currentPost?.id ? 'Зберегти зміни' : 'Створити'}</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

BlogManager.propTypes = {
    posts: PropTypes.array.isRequired,
    onSave: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};