import React, { Component } from 'react'
import AvatarEditor from 'react-avatar-editor'
import { Dialog, DialogContent, DialogContentText, DialogTitle, Button, DialogActions } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const CancelButton = withStyles((theme) => ({
    root: {
        color: '#5c34ae',
        backgroundColor: '#ffffff',
        textTransform: 'capitalize',
        border: '1px solid #5c34ae',
        fontWeight: 'bold',
        '&:hover': {
            backgroundColor: '#BFBFBF',
        },
    },
}))(Button);

const ConfirmButton = withStyles((theme) => ({
    root: {
        color: '#ffffff',
        backgroundColor: '#5c34ae',
        textTransform: 'capitalize',
        border: '1px solid #5c34ae',
        fontWeight: 'bold',
        '&:hover': {
            backgroundColor: '#5c34ae',
        },
    },
}))(Button);


class ProfileEditor extends Component {
    constructor(props) {
        super();

      
    }

    render() {
        return (
            <Dialog
                open={this.props.open}
                onClose={this.props.onClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{this.props.title ? this.props.title : 'Profile Editor'}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {`This is dialog Contetn`}
                    </DialogContentText>
                    <AvatarEditor
                        image={this.props.file}
                        width={150}
                        height={150}
                        border={50}
                        scale={1.2}
                    />
                </DialogContent>
                <DialogActions>
                    <CancelButton onClick={this.props.handleClose}>
                        {this.props.cancel ? this.props.cancel : 'cancel'}
                    </CancelButton>
                    <ConfirmButton onClick={this.props.handleUploadImage}>
                        {this.props.confirm ? this.props.confirm : 'save'}
                    </ConfirmButton>
                </DialogActions>
            </Dialog>
        )
    }
}

export default ProfileEditor;
