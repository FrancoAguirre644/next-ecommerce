const Toast = ({msg, handleShow, bgColor}) => {
    return (
        <div className={`toast show position-fixed text-light ${bgColor}`} role="alert"
        style={{ top: '5px', right: '5px', zIndex: 9, maxWidth: '280px'}}>
            <div className={`toast-header ${bgColor} text-light`}>
                <strong className="mr-auto">{msg.title}</strong>
                <button type="button" onClick={handleShow} className="ml-2 mb-1 text-light close" data-dismiss="toast">
                    <i className="fas fa-times" ></i>
                </button>
            </div>
            <div className="toast-body">
                {msg.msg}
            </div>
        </div>
    )
}

export default Toast