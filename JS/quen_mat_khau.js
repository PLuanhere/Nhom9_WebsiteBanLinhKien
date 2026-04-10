//SECTION
function laEmailHopLe(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

document.addEventListener('DOMContentLoaded', function () {

    const f1 = document.getElementById('formBuoc1');
    if (f1) {
        f1.onsubmit = function (e) {
            const email = document.getElementById('emailInput').value.trim();
            if (laEmailHopLe(email)) {
                localStorage.setItem('temp_email', email);
            } else {
                e.preventDefault();
                alert("Địa chỉ Email không hợp lệ. Vui lòng kiểm tra lại.");
            }
        };
    }

    const f2 = document.getElementById('formBuoc2');
    if (f2) {
        const emailDaLuu = localStorage.getItem('temp_email');
        const inputHienThi = document.getElementById('hienThiEmail');
        if (emailDaLuu && inputHienThi) {
            inputHienThi.value = emailDaLuu;
        }

        const maOTP_Random = Math.floor(100000 + Math.random() * 900000).toString();
        const otpDisplay = document.getElementById('fakeOtpDisplay');
        if (otpDisplay) {
            otpDisplay.innerText = maOTP_Random;
        }

        f2.onsubmit = function (e) {
            e.preventDefault();

            const otpNhapVao = document.getElementById('otpInput').value.trim();
            if (otpNhapVao === maOTP_Random) {
                window.location.href = "QuenMatKhau_Buoc3.html";
            } else {
                alert("Mã xác nhận không đúng! Vui lòng nhập chính xác 6 số hiển thị trên màn hình.");
                document.getElementById('otpInput').value = "";
                document.getElementById('otpInput').focus();
            }
        };
    }


    const formBuoc3 = document.getElementById('formBuoc3');

    if (formBuoc3) {
        formBuoc3.addEventListener('submit', function (event) {
            event.preventDefault();
            const matKhauMoi = document.getElementById('pass1').value;
            const xacNhanMatKhau = document.getElementById('pass2').value;
            if (matKhauMoi.length < 8) {
                alert("Mật khẩu mới phải có ít nhất 8 ký tự để an toàn !");
            }
            else if (matKhauMoi !== xacNhanMatKhau) {
                alert("Mật khẩu xác nhận không khớp. Vui lòng gõ lại !");
            }
            else {
                alert("Chúc mừng! Đổi mật khẩu thành công. Đang chuyển về trang Đăng nhập...");
                window.location.href = "FrmDangNhap.html";
            }
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
});
function togglePassword(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);

    if (input && icon) {
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        }
    }
}