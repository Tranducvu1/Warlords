// import * as pc from 'playcanvas';
// import { createMuzzleFlashEntity } from './createMuzzleFlashEntity';

// /**
//  * Triggers the muzzle flash effect.
//  * 
//  * @param {pc.Entity} muzzleFlashEntity - The muzzle flash entity created for the effect.
//  * @param {Record<string, pc.Asset>} assets - The assets containing the muzzle flash animation.
//  */
// export function triggerMuzzleFlash(muzzleFlashEntity: pc.Entity, assets: Record<string, pc.Asset>) {
//     muzzleFlashEntity.enabled = true; // Hiển thị hiệu ứng
//     muzzleFlashEntity.animation?.play(assets.muzzle_flash.name, 0.2); // Chạy animation flash

//     // Tắt hiệu ứng sau khi animation hoàn tất (sử dụng thời gian theo độ dài animation của bạn)
//     setTimeout(() => {
//         muzzleFlashEntity.enabled = false; // Tắt sau khi animation chạy xong
//     }, 100); // Điều chỉnh 100ms theo độ dài animation của bạn
// }
