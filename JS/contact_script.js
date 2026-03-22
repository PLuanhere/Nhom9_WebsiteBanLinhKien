function kiemTra() {
    var hoElem = document.getElementById("ho");
    var tenElem = document.getElementById("ten");
    var emailElem = document.getElementById("email");
    var sdtElem = document.getElementById("sdt");
    var qgElem = document.getElementById("qg");
    var messElem = document.getElementById("mess");
    var newsElem = document.getElementById("newsletter");

    var fName = hoElem.value;
    var lName = tenElem.value;
    var mail = emailElem.value;
    var phone = sdtElem.value;
    var country = qgElem.value;
    var subject = messElem.value;

    var nameReg = /^[A-ZÀ-Ỹ].+$/;
    var emailReg = /^[\w.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    var phoneReg = /^0[0-9]{9}$/;
    var contentReg = /\S+/;

    if (fName === "") {
        alert("Họ không được để trống");
        hoElem.focus();
        return false;
    } else if (!nameReg.test(fName)) {
        alert("Họ phải bắt đầu bằng chữ hoa");
        hoElem.focus();
        return false;
    }

    if (lName === "") {
        alert("Tên không được để trống");
        tenElem.focus();
        return false;
    } else if (!nameReg.test(lName)) {
        alert("Tên phải bắt đầu bằng chữ hoa");
        tenElem.focus();
        return false;
    }

    if (mail === "") {
        alert("Email không được để trống");
        emailElem.focus();
        return false;
    } else if (!emailReg.test(mail)) {
        alert("Định dạng Email không hợp lệ");
        emailElem.focus();
        return false;
    }

    if (phone !== "" && !phoneReg.test(phone)) {
        alert("Số điện thoại phải là chữ số bắt đầu bằng 0 và có 10 chữ số");
        sdtElem.focus();
        return false;
    }

    if (country === "") {
        alert("Vui lòng chọn quốc gia");
        qgElem.focus();
        return false;
    }

    if (subject === "" || !contentReg.test(subject)) {
        alert("Lời nhắn không được để trống");
        messElem.focus();
        return false;
    }

    if (!newsElem.checked) {
        alert("Bạn phải đồng ý với Điều khoản & Điều kiện");
        return false;
    }

    alert("Gửi thông tin thành công");
    return true;
}