export const SIGN_IMAGES: Record<string, any> = {
    a: require('./a.jpg'),
    b: require('./b.jpg'),
    c: require('./c.jpg'),
    d: require('./d.jpg'),
    e: require('./e.jpg'),
    f: require('./f.jpg'),
    g: require('./g.jpg'),
    h: require('./h.jpg'),
    i: require('./i.jpg'),
    j: require('./j.jpg'),
    k: require('./k.jpg'),
    l: require('./l.jpg'),
    m: require('./m.jpg'),
    n: require('./n.jpg'),
    o: require('./o.jpg'),
    p: require('./p.jpg'),
    q: require('./q.jpg'),
    r: require('./r.jpg'),
    s: require('./s.jpg'),
    t: require('./t.jpg'),
    u: require('./u.jpg'),
    v: require('./v.jpg'),
    w: require('./w.jpg'),
    x: require('./x.jpg'),
    y: require('./y.jpg'),
    z: require('./z.jpg'),
};

export function normalizeToSignKey(ch: string): string | null {
    const key = ch.toLowerCase();
    if (SIGN_IMAGES[key]) return key;
    if (key === ' ') return ' ';
    return null; // unsupported character
}
