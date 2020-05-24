import React from 'react';
import './modal.css'
const Modal = ({ onClose, show, title, children, footer }) => {

    const modalClassName = `video-modal modal ${show?'in display-block':'display-none'}`
    return (
        <div className={modalClassName}  tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel">
                <div className="modal-backdrop" onClick={({target}) =>(target.className === "modal-backdrop")?onClose():''}>
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">{title}</h4>
                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true" onClick={()=>onClose()}>&times;</button>

                        </div>
                        <div className="modal-body">
                            {children}
                        </div>
                        <div className="modal-footer">
                        {footer}
                            <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={onClose}>Go back</button>
                            
                        </div>
                    </div>
                </div>
                </div>
        </div>
    )
}

export default Modal