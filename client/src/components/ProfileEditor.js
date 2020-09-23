import React, { Component } from 'react'
import AvatarEditor from 'react-avatar-editor'
import { Dialog, DialogContent, DialogContentText, DialogTitle, Button, DialogActions } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const CancelButton = withStyles((theme) => ({
    root: {
        color: '#000000',
        backgroundColor: '#ffffff',
        textTransform: 'capitalize',
        border: '1px solid #3F3F3F',
        fontWeight: 'bold',
        '&:hover': {
            backgroundColor: '#BFBFBF',
        },
    },
}))(Button);
const ConfirmButton = withStyles((theme) => ({
    root: {
        color: '#ffffff',
        backgroundColor: '#000000',
        textTransform: 'capitalize',
        border: '1px solid #3F3F3F',
        fontWeight: 'bold',
        '&:hover': {
            backgroundColor: '#BFBFBF',
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
                        {this.props.cancel ? this.props.cancel : ''}
                    </CancelButton>
                    <ConfirmButton onClick={this.props.confirmSubmit}>
                        {this.props.confirm ? this.props.confirm : ''}
                    </ConfirmButton>
                </DialogActions>
            </Dialog>
        )
    }
}

export default ProfileEditor;
