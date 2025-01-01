import "./App.css";
import { useState, useEffect } from "react";

export function App() {
    const [items, setItems] = useState(['+5','-5','+10','x2','-10','+15','-15'])
    const [text, setText] = useState('');
    const [value, setValue] = useState('');
    const [showValue, setShowValue] = useState(false);
    const [wheelStyle, setWheelStyle] = useState('');
    const [angle, setAngle] = useState(0);
    const [textAngle, setTextAngle] = useState([]);
    const [isSpinning, setIsSpinning] = useState(false);
    const [imgUrl, setImgUrl] = useState(-1);
    const [cheat, setCheat] = useState('');

    const colors = [
        'rgb(105, 108, 255)',
        'rgb(251, 255, 0)',
        'rgb(255, 88, 216)',
        'rgb(113, 255, 66)',
        'rgb(255, 0, 123)',
        'rgb(66, 255, 242)',
        'rgb(255, 80, 80)',
        'rgb(214, 255, 90)',
        'rgb(90, 159, 255)',
        'rgb(255, 184, 90)'
    ]

    const handleTableChange = (e) => {
        if (isSpinning) return;
        setText(e.target.value);
        const newItems = text
            .split("\n")
            .filter((item) => item.trim() !== "");

        setItems(newItems);
    }

    const handleAngleChange = () => {
        let n = parseFloat(items.length);
        if (n < 2) {
            setWheelStyle('');
            setTextAngle([]);
            return;
        }
        let a = 100.0/n;
        let arr = [];
        for (let i = 0; i < n; i++) {
            arr.push(a * i + angle);
            if (arr[i] >= 100) arr[i] -= 100;
        }
        arr.push(arr[0]);
        let start = 0;
        for (let i = 1; i < n; i++) {
            if (arr[i] > arr[i - 1]) start = i;
            else break;
        }
        let str = 'conic-gradient(' + colors[start % colors.length] + ' 0% ' + arr[start + 1].toString() + '%,';
        start++;
        if (start >= n) start = 0;
        for (let i = 1; i < n; i++) {
            str += colors[start % colors.length];
            str += ' ';
            str += arr[start].toString();
            str += '% ';
            str += arr[start + 1].toString();
            str += '%,';
            start++;
            if (start >= n) start = 0;
        }
        str += colors[start % colors.length];
        str += ' ';
        str += arr[start].toString();
        str += '% 100%)';

        setWheelStyle(str);

        let textArr = [];
        for (let i = 0; i < n; i++) {
            if (arr[i + 1] < arr[i]) arr[i + 1] += 100;
            a=(arr[i] + arr[i + 1]) / 2 - 25;
            str = 'rotate(calc('+a.toString()+'*3.6deg))';
            textArr.push(str);
        }

        setTextAngle(textArr);
    }

    const handleClick = () => {
        if (isSpinning) return;
        setIsSpinning(true);
        let currentAngle = angle;
        let speed = 0;
        let time = 100 + Math.floor(Math.random() * 101);
        let start = 300;
        let end = 400;

        if (/^\d$/.test(cheat)) {
            let n = parseFloat(items.length);
            let a = 100.0/n;
            let l = Math.floor(200.0 - a * (parseFloat(cheat) + 1) + 2);
            let r = Math.floor(l + a - 2);
            let target = Math.floor(Math.random() * (r - l + 1)) + l;
            while (target >= 100) target -= 100;

            let tmpAngle = currentAngle;
            while (true) {
                tmpAngle += speed;
                if (tmpAngle >= 100) tmpAngle -= 100;
                if (start > 0) {
                    speed += 1.0/300.0;
                    start--;
                }
                else if (end > 0) {
                    end--;
                    speed -= 1.0/400;
                }
                else {
                    break;
                }
            }

            time = target + 200 - tmpAngle;

            start = 300;
            end = 400;
            speed = 0;
        }

        const interval = setInterval(() => {
            currentAngle += speed;
            if (currentAngle >= 100) currentAngle -= 100;
            setAngle(currentAngle);

            if (start > 0) {
                speed += 1.0/300.0;
                start--;
            }
            else if (time > 0) {
                speed = 1.0;
                time--;
            }
            else if (end > 0) {
                end--;
                speed -= 1.0/400;
            }
            else {
                if (currentAngle === 0) setValue(items[0]);
                else {
                    let n = parseFloat(items.length);
                    let a = 100.0/n;
                    for (let i = 0; i < n; i++) {
                        if (a * (i + 1) + currentAngle >= 100) {
                            setValue(items[i]);
                            break;
                        }
                    }
                    setShowValue(true);
                    a = imgUrl + 1;
                    if (a > 6) a = 0;
                    setImgUrl(a);
                }

                setIsSpinning(false);
                clearInterval(interval);
            }
        }, 8);
    }
    
    useEffect(() => {
        setText(items.join('\n'));
        handleAngleChange();

        const handleKeyUp = (e) => {
            setCheat(e.key);
            console.log(e.key);
        };

        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [])

    useEffect(() => {
        handleAngleChange();
    }, [items, angle])

    return (
        <div className="app-container">
            <div className="something">LUCKY WHEEL</div>
            <div className="container">
                <div className="wheel-container">
                    <div className="moc"/>
                    <div className="wheel" style={{background: wheelStyle}}>
                        {
                            items.length > 1 &&
                            <div className="wheel-content">
                                <div className="spin-button" onClick={handleClick}>Spin</div>
                                {
                                    items.map((item, index) => (
                                        <div className="wheel-text" key={index} style={{transform: textAngle[index]}}>{item}</div>
                                    ))
                                }
                            </div>
                        }
                        {
                            items.length < 2 &&
                            <div className="no-items">?</div>
                        }
                    </div>
                </div>
                <div className="config-table">
                    <div className="table-description">
                        Điền vào đây!!!
                    </div>
                    <textarea
                        value={text}
                        onChange={handleTableChange}
                        className="editor"
                    />
                </div>
                {
                    showValue &&
                    <div className="overlay" onClick={() => setShowValue(false)}>
                        <div className="show-result" onClick={(e) => e.stopPropagation()}>
                            <div className="result">Chúc mừng!!!</div>
                            <div className="result">{'Bạn đã quay vào ô ' + value}</div>
                            <img className="result-img" src={'./img/img'+imgUrl.toString()+'.png'}/>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}