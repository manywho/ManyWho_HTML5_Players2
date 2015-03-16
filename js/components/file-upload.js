﻿(function (manywho) {

    var fileUpload = React.createClass({
        
        onUpload: function (e) {

            this.setState({
                isUploadDisabled: true,
                isProgressVisible: true,
                progress: 0
            });

            var self = this;

            var request = new FormData();
            request.append('FileDataRequest', JSON.stringify(this.props.fileDataRequest));
            request.append('FileData', this.refs.upload.getDOMNode().files[0]);

            var tenantId = manywho.utils.extractTenantId(this.props.flowKey);
            var authenticationToken = manywho.state.getAuthenticationToken(this.props.flowKey);

            manywho.ajax.uploadFile(request, tenantId, authenticationToken, function(e) {

                if (e.lengthComputable) {

                    self.setState({ progress: parseInt(e.loaded / e.total * 100) });
                    
                }

            })
            .done(function () {

                self.setState({
                    isUploadDisabled: false,
                    isProgressVisible: false,
                    progress: 0
                });

                if (self.props.onUploadComplete) {

                    self.props.onUploadComplete();

                }

            });

        },

        onFileSelected: function (e) {

            this.setState({ fileName: e.currentTarget.files[0].name });

        },

        getInitialState: function() {

            return {
                isUploadDisabled: false,
                isProgressVisible: false
            }

        },

        render: function () {

            log.info('Rendering File Upload' + this.props.id);

            var progress = (this.state.progress || 0) + '%';

            return React.DOM.div(null, [
                React.DOM.div({ className: 'clearfix' }, [
                    React.DOM.button({ className: 'btn btn-default pull-left', disabled: this.state.isUploadDisabled, onClick: this.onUpload }, 'Upload'),
                    React.DOM.div({ className: 'form-group pull-left file-upload-browse' },
                        React.DOM.div({ className: 'input-group' }, [
                            React.DOM.span({ className: 'input-group-btn' },
                                React.DOM.span({ className: 'btn btn-primary btn-file', disabled: this.state.isUploadDisabled }, [
                                    'Browse',
                                    React.DOM.input({ type: 'file', onChange: this.onFileSelected, ref: 'upload' })
                                ])
                            ),
                            React.DOM.input({ type: 'text', className: 'form-control file-selected', readOnly: 'readonly', value: this.state.fileName })
                        ])
                    )
                ]),
                React.DOM.div({ className: 'progress ' + ((this.state.isProgressVisible) ? '' : 'hidden') },
                    React.DOM.div({ className: 'progress-bar', style: { width: progress } })
                )
            ]);

        }

    });

    manywho.component.register("file-upload", fileUpload);

}(manywho));