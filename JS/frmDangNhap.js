//SECTION
function laEmailHopLe(email) {
    const quyTac = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return quyTac.test(email);
}

const formDangNhap = document.getElementById('formDangNhap');

if (formDangNhap) {
    formDangNhap.addEventListener('submit', function (suKien) {
        suKien.preventDefault();

        const email = document.getElementById('dnEmail').value.trim();
        const matKhau = document.getElementById('dnMatKhau').value.trim();

        if (email === '') {
            alert("Vui lòng nhập email !");
            return;
        } else if (!laEmailHopLe(email)) {
            alert("Sai định dạng email , vui lòng nhập lại ! ");
            return;
        }

        if (matKhau === '') {
            alert("Vui lòng nhập mật khẩu ! ");
            return;
        }

        alert("Đăng nhập thành công !");
    });
}
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