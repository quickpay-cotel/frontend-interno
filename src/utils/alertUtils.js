// utils/alertUtils.js
import Swal from 'sweetalert2'

export const showToast = ({ icon, title, text }) => {
  Swal.fire({
    icon,
    title,
    text,
    timer: 3000,
    timerProgressBar: true,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
  })
}
// utils/alertUtils.js
export const showDialog = ({
  icon,
  title,
  text,
  confirmButtonText = 'Aceptar',
  confirmButtonColor = '#0D47A1',
  confirmButtonTextClass = 'swal-text-white',
  showCancelButton = false,
  cancelButtonText = 'Cancelar',
  cancelButtonTextClass = 'swal-text-white',
}) => {
  return Swal.fire({
    icon,
    title,
    text,
    confirmButtonText,
    confirmButtonColor,
    showCancelButton,
    cancelButtonText,
    allowOutsideClick: false,
    allowEscapeKey: false,
    customClass: {
      confirmButton: confirmButtonTextClass,
      cancelButton: cancelButtonTextClass, // ✅ Añade esta línea
    },
  })
}




