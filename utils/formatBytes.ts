const KB = 1024;
const MB = KB * 1024;

const formatBytes: (sizeInBytes: number) => string = (sizeInBytes) => {
    if (sizeInBytes < KB) {
        return sizeInBytes + " B";
    } else if (sizeInBytes < MB) {
        const sizeInKB = (sizeInBytes / KB).toFixed(2);
        return sizeInKB + " KB";
    } else {
        const sizeInMB = (sizeInBytes / MB).toFixed(2);
        return sizeInMB + " MB";
    }
};

export default formatBytes;
