document.addEventListener('DOMContentLoaded', function() {
    // OCP格式定义
    const ocpFormats = {
        'mxfp8': {signBits: 1, exponentBits: 4, mantissaBits: 3, bias: 7, totalBits: 8},
        'mxfp6': {signBits: 1, exponentBits: 3, mantissaBits: 2, bias: 3, totalBits: 6},
        'mxfp4': {signBits: 1, exponentBits: 2, mantissaBits: 1, bias: 1, totalBits: 4},
        'mxint8': {isInt: true, totalBits: 8}
    };

    let currentFormat = 'mxfp8';
    
    // 格式选择按钮事件
    document.querySelectorAll('.format-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.format-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFormat = this.dataset.format;
            
            // 更新输入框的最大长度
            document.getElementById('custom-bits').maxLength = ocpFormats[currentFormat].totalBits;
            
            // 生成新的随机值
            generateRandomValue();
        });
    });
    
    // 应用自定义输入
    document.getElementById('apply-btn').addEventListener('click', function() {
        const customBits = document.getElementById('custom-bits').value;
        if (isValidBinary(customBits, ocpFormats[currentFormat].totalBits)) {
            updateFormatDisplay(currentFormat, customBits);
        } else {
            alert(`请输入有效的${ocpFormats[currentFormat].totalBits}位二进制值（仅包含0和1）`);
        }
    });
    
    // 生成随机值
    document.getElementById('random-btn').addEventListener('click', function() {
        generateRandomValue();
    });
    
    // 生成随机值函数
    function generateRandomValue() {
        const format = ocpFormats[currentFormat];
        let binaryString = '';
        
        for (let i = 0; i < format.totalBits; i++) {
            binaryString += Math.round(Math.random());
        }
        
        document.getElementById('custom-bits').value = binaryString;
        updateFormatDisplay(currentFormat, binaryString);
    }
    
    // 更新显示
    function updateFormatDisplay(formatId, binaryString) {
        const format = ocpFormats[formatId];
        const section = document.getElementById(formatId);
        
        // 更新位值显示
        const bitValues = section.querySelectorAll('.bit-value');
        const bits = section.querySelectorAll('.bit');
        
        // 先隐藏所有位
        bitValues.forEach(bit => bit.style.display = 'none');
        bits.forEach(bit => bit.style.display = 'none');
        
        // 显示有效位
        for (let i = 0; i < format.totalBits; i++) {
            const bitIndex = format.totalBits - 1 - i; // 反转索引以适应显示顺序
            bitValues[bitIndex].textContent = binaryString[i];
            bitValues[bitIndex].style.display = 'flex';
            bits[bitIndex].style.display = 'flex';
            
            // 根据位类型添加颜色
            if (format.isInt) {
                bitValues[bitIndex].style.backgroundColor = '#f0f0f0';
            } else {
                if (i === 0) {
                    bitValues[bitIndex].style.backgroundColor = 'rgba(255, 107, 107, 0.2)';
                } else if (i < format.exponentBits + 1) {
                    bitValues[bitIndex].style.backgroundColor = 'rgba(77, 171, 247, 0.2)';
                } else {
                    bitValues[bitIndex].style.backgroundColor = 'rgba(46, 204, 113, 0.2)';
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
    
    // 验证二进制输入
    function isValidBinary(input, length) {
        const binaryRegex = new RegExp(`^[01]{${length}}$`);
        return binaryRegex.test(input);
    }
    
    // 初始显示随机值
    generateRandomValue();
});