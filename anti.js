    //<![CDATA[
    (function() {
        'use strict';

        // --- CẤU HÌNH ---
        const CONFIG = {
            ENABLED: true, // Bật/tắt toàn bộ kịch bản
            REDIRECT_URL: 'https://www.facebook.com/letronghaidang.limited', // Trang sẽ chuyển hướng đến
            BLOCK_RIGHT_CLICK: true, // Chặn chuột phải
            BLOCK_SHORTCUTS: true, // Chặn các phím tắt
            USE_DEBUGGER_CHECK: true, // Dùng kỹ thuật kiểm tra debugger
            USE_DIMENSION_CHECK: true, // Dùng kỹ thuật kiểm tra kích thước cửa sổ
            USE_CONSOLE_LOG_CHECK: false, // Dùng kỹ thuật kiểm tra console.log (có thể không ổn định)
            ACTION_CLEAR_CONSOLE: true, // Xóa console liên tục
            ACTION_BLANK_PAGE: true, // Xóa trắng nội dung trang khi bị phát hiện
            ACTION_REDIRECT: true, // Chuyển hướng khi bị phát hiện
            ACTION_FREEZE_TAB: true, // Làm treo tab khi bị phát hiện (CỰC KỲ MẠNH)
            OBFUSCATE_STRINGS: true, // Làm rối các chuỗi văn bản
            INTERVAL_MS: 500 // Tần suất kiểm tra (miligiây)
        };

        if (!CONFIG.ENABLED) return;

        let devToolsOpened = false;
        let actionTriggered = false;

        const STRINGS = {
            // Chuỗi đã được mã hóa Base64 để tránh tìm kiếm văn bản đơn giản
            // Nguyên bản: "HÀNH VI BẤT THƯỜNG BỊ PHÁT HIỆN. TRUY CẬP CỦA BẠN ĐÃ BỊ CHẶN."
            blockedMessage: 'SEMOTIBIIBISEIgQsgVCBIkhVIExBIFAgSEFUgVEhJg44OCBC44OCBC44OEIExBIFAgQ1VCIEPhg4ogQsgVCBC44OEIQ0gPTg4o='
        };

        function getString(key) {
            if (CONFIG.OBFUSCATE_STRINGS && STRINGS[key]) {
                try {
                    return atob(STRINGS[key].replace(/\s/g, ''));
                } catch (e) {
                    // Fallback in case of error
                    return "Blocked.";
                }
            }
            return key;
        }
        
        // HÀM KÍCH HOẠT HÀNH ĐỘNG CHẶN
        function triggerAction() {
            if (actionTriggered) return;
            actionTriggered = true;

            // Xóa console một lần cuối
            console.clear();
            
            if (CONFIG.ACTION_BLANK_PAGE) {
                try {
                    document.body.innerHTML = `<div style="position:fixed;top:0;left:0;width:100%;height:100%;background-color:#000;color:#f00;font-family:monospace;font-size:24px;display:flex;justify-content:center;align-items:center;text-align:center;padding:20px;">${getString('blockedMessage')}</div>`;
                } catch (e) {}
            }

            if (CONFIG.ACTION_REDIRECT) {
                try {
                    window.location.replace(CONFIG.REDIRECT_URL);
                } catch (e) {}
            }

            // Làm treo tab (phương pháp cuối cùng)
            if (CONFIG.ACTION_FREEZE_TAB) {
                while (true) {}
            }
        }

        // CÁC KỸ THUẬT PHÁT HIỆN
        const detectors = {
            // 1. Kỹ thuật đo thời gian debugger
            debuggerCheck: function() {
                if (!CONFIG.USE_DEBUGGER_CHECK) return;
                const startTime = performance.now();
                debugger;
                const endTime = performance.now();
                if (endTime - startTime > 100) {
                    devToolsOpened = true;
                }
            },

            // 2. Kỹ thuật so sánh kích thước cửa sổ
            dimensionCheck: function() {
                if (!CONFIG.USE_DIMENSION_CHECK) return;
                const widthThreshold = window.outerWidth - window.innerWidth > 160;
                const heightThreshold = window.outerHeight - window.innerHeight > 160;
                if (widthThreshold || heightThreshold) {
                    devToolsOpened = true;
                }
            },
            
            // 3. Kỹ thuật dùng console.log (tùy chọn)
            consoleLogCheck: function() {
                if (!CONFIG.USE_CONSOLE_LOG_CHECK) return;
                const el = document.createElement('div');
                Object.defineProperty(el, 'id', {
                    get: function() {
                        devToolsOpened = true;
                    }
                });
                console.log(el);
            }
        };

        // VÒNG LẶP KIỂM TRA CHÍNH
        function mainCheck() {
            // Chạy các hàm phát hiện
            for (const key in detectors) {
                detectors[key]();
            }

            if (CONFIG.ACTION_CLEAR_CONSOLE) {
                console.clear();
                console.log('%c ', 'font-size:100px; background:url(https://i.imgur.com/r3b018j.png) no-repeat;');
                console.warn('Console đã bị vô hiệu hóa trên trang này.');
            }

            if (devToolsOpened) {
                triggerAction();
            }
        }

        // CHẶN CÁC SỰ KIỆN
        if (CONFIG.BLOCK_SHORTCUTS) {
            document.addEventListener('keydown', function(e) {
                const key = e.key.toUpperCase();
                const keyCode = e.keyCode;

                if (keyCode === 123 || // F12
                    (e.ctrlKey && e.shiftKey && (key === 'I' || keyCode === 73)) || // Ctrl+Shift+I
                    (e.ctrlKey && e.shiftKey && (key === 'J' || keyCode === 74)) || // Ctrl+Shift+J
                    (e.ctrlKey && e.shiftKey && (key === 'C' || keyCode === 67)) || // Ctrl+Shift+C
                    (e.ctrlKey && (key === 'U' || keyCode === 85)) || // Ctrl+U
                    (e.ctrlKey && (key === 'S' || keyCode === 83)) // Ctrl+S
                ) {
                    e.preventDefault();
                    triggerAction();
                }
            }, true);
        }

        if (CONFIG.BLOCK_RIGHT_CLICK) {
            document.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                triggerAction();
            }, true);
        }

        // KHỞI ĐỘNG VÒNG LẶP KIỂM TRA
        // Dùng `new Function` để giấu đi việc gọi `setInterval` một cách đơn giản
        try {
            new Function('setInterval(mainCheck, CONFIG.INTERVAL_MS)')();
        } catch (e) {
            // Fallback
            setInterval(mainCheck, CONFIG.INTERVAL_MS);
        }
    })();
    //]]>