const init = () => {

    let mouse = {
        click: false,
        move: false,
        rightClick: false,
        pos: {
            x: 0, y:0,
        },
        prev: false
    };

    // Canvas
    const canvas = document.getElementById('drawing');
    const context = canvas.getContext('2d');    
    const toolBarOffset = 32;
    const width = window.innerWidth;
    const height = window.innerHeight;
    let strokeColor = '#FFF';

    canvas.width = width;
    canvas.height = height;

    document.getElementById('resetButton').addEventListener('click', () => {
        console.log('Borrando ando');        
        socket.emit('resetCanvas');
    });

    document.getElementById('yellowButton').addEventListener('click', () => {
        strokeColor = '#FFFF00'
    });
    document.getElementById('whiteButton').addEventListener('click', () => {
        strokeColor = '#FFFFFF'
    });
    document.getElementById('blueButton').addEventListener('click', () => {
        strokeColor = '#0000FF'
    });
    document.getElementById('greenButton').addEventListener('click', () => {
        strokeColor = '#00FF00'
    });
    document.getElementById('redButton').addEventListener('click', () => {
        strokeColor = '#FF0000'
    });

    document.getElementById('downloadButton').addEventListener('click', () => {
        image = canvas.toDataURL("image/png", 1.0).replace("image/png", "image/octet-stream");
        let link = document.createElement('a');
        link.download = "draw.png";
        link.href = image;
        link.click();
    });

    const socket = io();

    canvas.addEventListener('mousedown', (e) => {
        mouse.click = true;
    });

    canvas.addEventListener('mouseup', (e) => {
        mouse.click = false;
    });

    canvas.addEventListener('mousemove', (e) => {
        mouse.pos.x = e.clientX / width;
        mouse.pos.y = (e.clientY - toolBarOffset) / height;
        mouse.move = true;
    });

    socket.on('resetCanvas', () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
    })

    socket.on('draw_line', data => {
        const line = data.line;
        context.strokeStyle = line[2];
        context.beginPath();
        context.lineWidth = 2;
        context.moveTo(line[0].x * width, line[0].y * height);
        context.lineTo(line[1].x * width, line[1].y * height);
        context.stroke();
    });

    const update = () => {
        if(mouse.click && mouse.move && mouse.prev){
            socket.emit('draw_line', {line: [mouse.pos, mouse.prev, strokeColor]});
            mouse.move = false;
        }
        mouse.prev = {x: mouse.pos.x, y: mouse.pos.y};
        setTimeout(update, 15);
    }

    update();
}

document.addEventListener('DOMContentLoaded', init)