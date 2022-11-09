class TMDBservice {
    token = '5d90c2f6fa0965b9b96b0b00866234d9';
    baseURL = 'https://api.themoviedb.org/3';

    async fetchURL(url) {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Could not fetch, received ${res.status}`);
        };
        return await res.json();
    }

    async getMovies(request, page) {
        const url = `${this.baseURL}/search/movie?api_key=${this.token}&query=${request}&page=${page}`;

        return await this.fetchURL(url);
    }

    async getGenres() {
        const url = `${this.baseURL}/genre/movie/list?api_key=${this.token}`;

        return await this.fetchURL(url);
    }

    async newGuestSession() {
        const url = `${this.baseURL}/authentication/guest_session/new?api_key=${this.token}`;
        const res = await this.fetchURL(url)
        
        return res.guest_session_id;
    }

    async getRatedMovies(page) {
        const session_id = JSON.parse(localStorage.getItem('guest_session_id'));const url = `${this.baseURL}/guest_session/${session_id}/rated/movies?api_key=${this.token}&page=${page}&sort_by=created_at.desc`;

        return await this.fetchURL(url);
    }

    async postRating(id, value) {
        const session_id = JSON.parse(localStorage.getItem('guest_session_id'));
        const url = `${this.baseURL}/movie/${id}/rating?api_key=${this.token}&guest_session_id=${session_id}`;
        const body = {
            value: value
        }
        const headers = {
            'Content-Type': 'application/json;charset=utf-8'
        }

        return await fetch(url, {method: 'POST', headers: headers, body: JSON.stringify(body)})
    }
}

export default TMDBservice;
