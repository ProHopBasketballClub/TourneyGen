export const user_route = '/Api/user';

export function generate_get_route(route, args) {
    let get_route = route + '?';
    for (const [key, value] of Object.entries(args)) {
        get_route += key.toString() + '=' + value.toString() + '&';
    }

    // Don't return the last &.
    return get_route.slice(0, -1);
}
