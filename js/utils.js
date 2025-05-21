// js/utils.js

const Utils = {
    /**
     * 生成指定范围内的随机整数 (包含min和max)
     * @param {number} min - 最小值
     * @param {number} max - 最大值
     * @returns {number} 随机整数
     */
    getRandomInt: function(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /**
     * 从数组中随机选择一个元素
     * @param {Array<any>} array - 输入数组
     * @returns {any} 数组中的随机元素，如果数组为空则返回undefined
     */
    getRandomElement: function(array) {
        if (!array || array.length === 0) {
            return undefined;
        }
        return array[Math.floor(Math.random() * array.length)];
    },

    /**
     * 生成一个简单的UUID (非严格标准，用于唯一标识)
     * @returns {string} 类UUID字符串
     */
    generateUUID: function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },

    /**
     * 深拷贝一个对象 (基础版，不能处理函数、Date、RegExp等复杂情况)
     * @param {object} obj - 需要拷贝的对象
     * @returns {object} 拷贝后的新对象
     */
    deepClone: function(obj) {
        if (typeof obj !== 'object' || obj === null) {
            return obj; // 基本类型或null直接返回
        }
        // 处理数组和对象
        const newObj = Array.isArray(obj) ? [] : {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                newObj[key] = Utils.deepClone(obj[key]);
            }
        }
        return newObj;
    },

    /**
     * 格式化数字，例如添加千位分隔符
     * @param {number} num - 需要格式化的数字
     * @returns {string} 格式化后的字符串
     */
    formatNumber: function(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    /**
     * 模拟掷骰子，判断是否命中概率 (0-100)
     * @param {number} probability - 0到100之间的概率值
     * @returns {boolean} 是否命中
     */
    rollPercentage: function(probability) {
        if (probability <= 0) return false;
        if (probability >= 100) return true;
        return Math.random() * 100 < probability;
    }
};

console.log("Utils module loaded.");
