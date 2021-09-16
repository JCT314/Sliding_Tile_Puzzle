class StopWatch {
    constructor(showElement, totalDuration = 0) {
        this.showElement = showElement;
        this.totalDuration = totalDuration;
        this.timeLeft = totalDuration;
        this.showElement.innerText = this.getTime();
    }

    start(tickInterval = 50) {
        if (!this.stopWatchId) {
            this.stopWatchId = setInterval(() => {
                if (this.timeLeft < 0) {
                    this.timeLeft = 0;
                    clearInterval(this.stopWatchId);
                    this.stopWatchId = null;
                }
                this.showElement.innerText = this.getTime();
                this.timeLeft += tickInterval / 1000;
            }, tickInterval)
        }

    }

    pause() {
        if (this.stopWatchId) {
            clearInterval(this.stopWatchId);
            this.stopWatchId = null;
        }
    }

    reset() {
        this.timeLeft = this.totalDuration;
        this.showElement.innerText = this.getTime();
    }

    getTime() {
        return `Time - ${this.toTime()}`
    }

    toTime() {
        const minutes = parseInt(this.timeLeft / 60);
        const seconds = (this.timeLeft % 60).toFixed(0);
        return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    }

    parseTime(value) {
        const minutes = parseInt(value / 60);
        const seconds = (value % 60).toFixed(0);
        return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    }
}