import { defineConfig } from 'vite';

export default defineConfig({
 server:{
  open:true,
  port:2900,
 },
  publicDir: 'assets', // This will copy the assets folder to the dist folder
});