import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import VueSetupExtend from 'vite-plugin-vue-setup-extend';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers';

export default defineConfig({
    base: './',
    plugins: [
        vue(),
        VueSetupExtend(),
        AutoImport({
            resolvers: [ElementPlusResolver()]
        }),
        Components({
            resolvers: [ElementPlusResolver()]
        })
    ],
	server: {
		proxy: {
			"/api": {
				//本地地址
				target: "http://127.0.0.1:8081",
				//允许跨域
				changeOrigin: true,
				// 访问后端地址时候，将api后缀干掉
				rewrite: (path => path.replace(/^\/api/, ""))
			}
		}
	}
	,
    optimizeDeps: {
        include: ['schart.js']
    }
});
