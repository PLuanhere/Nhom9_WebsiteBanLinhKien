//SECTION
// Kiem tra dinh dang email co hop le hay khong //
function laEmailHopLe(email) {
    const quyTac = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return quyTac.test(email);
}

const formDangKy = document.getElementById('formDangKy');

if (formDangKy) {
    formDangKy.addEventListener('submit', function (suKien) {
        suKien.preventDefault();
        const hoTen = document.getElementById('dkHoTen').value.trim();
        const email = document.getElementById('dkEmail').value.trim();
        const matKhau = document.getElementById('dkMatKhau').value.trim();
        const xacNhan = document.getElementById('dkXacNhan').value.trim();
        if (hoTen === '') {
            alert("Vui lòng nhập họ tên !");
            return;
        }
        if (hoTen.length < 2) {
            alert("Tên không hợp lệ !");
            return;
        }
        if (!/^[A-ZÀ-Ỹ]/.test(hoTen)) {
            alert("Chữ cái đầu tiên của họ tên phải viết hoa!");
            return;
        }
        if (!/^[a-zA-ZÀ-Ỹa-zá-ỹ\s]+$/.test(hoTen)) {
            alert("Họ tên chỉ được chứa chữ cái, không được có số hay kí tự đặc biệt!");
            return;
        }
        if (email === '') {
            alert("Vui lòng nhập địa chỉ email!");
            return;
        } else if (!laEmailHopLe(email)) {
            alert("Email chưa đúng định dạng (VD: xxxx@gmail.com) , vui lòng kiểm tra lại!");
            return;
        }
        if (matKhau === '') {
            alert("Chưa nhập mật khẩu !");
            return;
        }
        if (matKhau.length < 8) {
            alert("Mật khẩu yếu , phải dài ít nhất 8 kí tự!");
            return;
        }
        if (!/[A-Z]/.test(matKhau)) {
            alert("Mật khẩu phải chứa ít nhất 1 chữ cái IN HOA!");
            return;
        }
        if (!/[a-z]/.test(matKhau)) {
            alert("Mật khẩu phải chứa ít nhất 1 chữ cái viết thường!");
            return;
        }
        if (!/[0-9]/.test(matKhau)) {
            alert("Mật khẩu phải có ít nhất 1 chữ số!");
            return;
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(matKhau)) {
            alert("Mật khẩu phải có ít nhất 1 kí tự đặc biệt (Ví dụ: @, #, $,...)!");
            return;
        }
        if (xacNhan === '') {
            alert("Nhập lại mật khẩu để xác nhận ");
            return;
        } else if (matKhau !== xacNhan) {
            alert("Mật khẩu không khớp");
            return;
        }
        alert('Đăng ký thành công !');
    });
}
// Hien/An mat khau cho o nhap va dong bo icon mat //
function togglePassword(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);

    if (input && icon) {
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
        else {
            input.type = 'password';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        }
    }
}