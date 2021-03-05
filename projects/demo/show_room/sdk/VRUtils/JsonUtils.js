export class JsonUtils {
    static toSmallCaseVector(json) {
        if (!json) {
            return;
        }

        json = json.replace(/"X"/g, "\"x\"");
        json = json.replace(/"Y"/g, "\"y\"");
        json = json.replace(/"Z"/g, "\"z\"");

        return json;
    }

    static fromJson(json, cls) {
        if (!json) {
            return;
        }

        try {
            if (typeof json === 'string') {
                json = JSON.parse(json);
            }
            return fromJsonObj(json, cls);
        } catch (e) {
            console.log("fromJson: " + e);
        }

        function fromJsonObj(obj, cls) {
            if (obj === undefined) {
                return;
            }

            if (obj instanceof Array) {
                return obj.map(o => fromJsonObj(objToClass(o, cls), cls));
            } else {
                obj = objToClass(obj, cls);
            }

            let classMapper = new (cls)().ClassMapper;

            if (!classMapper) {
                return obj;
            }

            let properties = Object.getOwnPropertyNames(obj);

            for (let key in classMapper) {
                let property = properties.find(property => property.toString() === key);

                if (property) {
                    obj[property] = fromJsonObj(obj[property], classMapper[key]);
                }
            }

            return obj;
        }

        function objToClass(obj, cls) {
            let newObj = new cls();
            let modelPropMap = {};
            let propUpperCase;

            for (let propName in newObj) {
                let key = propName.toUpperCase();
                modelPropMap[key] = propName;
            }

            for (let propName in obj) {
                propUpperCase = propName.toUpperCase();
                if (modelPropMap.hasOwnProperty(propUpperCase)) {
                    newObj[modelPropMap[propUpperCase]] = obj[propName];
                }
            }

            return newObj;
        }
    }
}
