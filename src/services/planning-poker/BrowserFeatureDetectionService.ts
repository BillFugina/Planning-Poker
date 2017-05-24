import { IBrowserFeatureDetectionService } from "services/planning-poker";

export class BrowserFeatureDetectionService implements IBrowserFeatureDetectionService {
    is_touch_device() {
        return !!('ontouchstart' in window        // works on most browsers 
            || navigator.maxTouchPoints)       // works on IE10/11 and Surface
    };

    hasHover(){
        return window.matchMedia('(hover), not(hover)').matches
    }
}