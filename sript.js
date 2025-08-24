// script.js
document.addEventListener('DOMContentLoaded', function() {
    // OCP格式定义
    const ocpFormats = {
        'mxfp8': {signBits: 1, exponentBits: 4, mantissaBits: 3, bias: 7},
        'mxfp6': {signBits: 1, exponentBits: 3, mantissaBits: 2, bias: 3},
        'mxfp4': {signBits: 1, exponentBits: 2, mantissaBits: 1, bias: 1},
        'mxint8': {isInt: true}
    };

    // 生成随机二进制值
    document.getElementById('random-btn').addEventListener('click', function() {
        for (const formatId in ocpFormats) {
            const format = ocpFormats[formatId];
            const totalBits = format.isInt ? 8 : format.signBits + format.exponentBits + format.mantissaBits;
            let binaryString = '';
            
            for (let i = 0; i < totalBits; i++) {
                binaryString += Math.round(Math.random());
            }
            
            updateFormatDisplay(formatId, binaryString);
        }
    });

    // 更新显示
    function updateFormatDisplay(formatId, binaryString) {
        const format = ocpFormats[formatId];
        const section = document.getElementById(formatId);
        
        // 更新位值显示
        const bitValues = section.querySelectorAll('.bit-value');
        for (let i = 0; i < binaryString.length; i++) {
            const bitIndex = binaryString.length - 1 - i; // 反转索引以适应显示顺序
            bitValues[bitIndex].textContent = binaryString[i];
            
            // 根据位类型添加颜色
            if (format.isInt) {
                bitValues[bitIndex].style.backgroundColor = '#f0f0f0';
            } else {
                if (i === 0) {
                    bitValues[bitIndex].style.backgroundColor = 'rgba(255, 200, 200, 0.3)';
                } else if (i < format.exponentBits + 1) {
                    bitValues[bitIndex].style.backgroundColor = 'rgba(200, 220, 255, 0.3)';
                } else {
                    bitValues[bitIndex].style.backgroundColor = 'rgba(200, 255, 220, 0.3)';
                }
            }
        }
        
        // 更新计算值
        if (!format.isInt) {
            const sign = binaryString[0] === '0' ? 1 : -1;
            const exponentBits = binaryString.substring(1, 1 + format.exponentBits);
            const mantissaBits = binaryString.substring(1 + format.exponentBits);
            
            const exponent = parseInt(exponentBits, 2) - format.bias;
            const mantissa = calculateMantissa(mantissaBits, format.mantissaBits);
            
            const value = sign * Math.pow(2, exponent) * mantissa;
            
            section.querySelector('.binary-value').textContent = binaryString;
            section.querySelector('.hex-value').textContent = '0x' + parseInt(binaryString, 2).toString(16).toUpperCase();
            section.querySelector('.calculated-value').textContent = 
                `${sign} × 2^${exponent} × ${mantissa.toFixed(3)} = ${value.toFixed(4)}`;
        } else {
            // 整数处理
            const value = parseInt(binaryString, 2);
            section.querySelector('.binary-value').textContent = binaryString;
            section.querySelector('.hex-value').textContent = '0x' + value.toString(16).toUpperCase();
            section.querySelector('.calculated-value').textContent = value.toString();
        }
    }

    // 计算尾数值
    function calculateMantissa(bits, mantissaBits) {
        if (parseInt(bits, 2) === 0) {
            return 0; // 处理零值
        }
        
        let mantissa = 1; // 隐含的前导1
        for (let i = 0; i < bits.length; i++) {
            if (bits[i] === '1') {
                mantissa += Math.pow(2, - (i + 1));
            }
        }
        
        return mantissa;
    }

    // 初始显示随机值
    document.getElementById('random-btn').click();
});