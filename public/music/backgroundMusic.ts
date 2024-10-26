import * as pc from 'playcanvas';

export function addBackgroundMusic(app: pc.Application) {
    // Tạo entity âm thanh
    const audioEntity = new pc.Entity('BackgroundMusic');

    // Thêm thành phần âm thanh
    audioEntity.addComponent('audio', {
        sources: [{
            url: 'path/to/your/background-music.mp3', // Đường dẫn tới tệp âm thanh
            preload: true // Tải trước âm thanh
        }],
        volume: 1, // Âm lượng, từ 0 đến 1
        loop: true // Bật chế độ lặp lại
    });

    // Thêm entity vào root
    app.root.addChild(audioEntity);

    // Đảm bảo âm thanh đã tải xong trước khi phát
    audioEntity.sound?.on('load', () => {
        audioEntity.sound?.play('BackgroundMusic');
    });

    // Bắt đầu phát nhạc ngay lập tức
    audioEntity.sound?.play('BackgroundMusic');
}



