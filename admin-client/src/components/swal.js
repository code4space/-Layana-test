import Swal from "sweetalert2";

export function swalError(error) {
    return Swal.fire({
        icon: "error",
        title: `ERROR ${error.response.status}`,
        text: error.response.data.message,
    });
}

export function swalErrorWithMessage(message) {
    return Swal.fire({
        icon: "error",
        title: `ERROR`,
        text: message,
    });
}

export function swalTopEnd(title = "Success", timer = 1500) {
    return Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: title,
        showConfirmButton: false,
        timer: timer
    })
}