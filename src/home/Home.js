import React from 'react';
import './Home.css'
import Axios from 'axios';
import Post from '../entity/Post';

const colors = ['#8DD7BF', '#FF96C5', '#FFD872', '#FF6F68', '#6C88C4']

export default class Home extends React.Component {

    constructor(props){
        super(props)

        this.state = {
            posts: [],
            colorIndex: 0
        }
    }

    componentDidMount = () => {
        Axios.get("/posts").then((response) => {
            console.log(response.data)
            this.setState({
                posts: response.data
            })
        })
    }

    static getDerivedStateFromProps(props, state){
        state.colorIndex = Math.floor(Math.random() * 5)

        return state
    }

    likeOrDislikePost = (event, dislike, post) => {
        event.preventDefault()
        let url = `/posts/${post.id}/${dislike ? "dislike" : "like"}`
        Axios.post(url).then((response) => {
            post.voted = true
            post.votes = response.data
            this.forceUpdate()
        })
    }

    renderLikeAndDislike = (post) => {
        return (
            <div>
                <button onClick={(event) => this.likeOrDislikePost(event, false, post)}>+</button>
                <button onClick={(event) => this.likeOrDislikePost(event, true, post)}>-</button>
            </div>
        )
    }

    renderPosts = () => {
        return this.state.posts.map((post) => 
            <div key={`${post.id}`} className='post-container' style={{backgroundColor: post.color}}>
                {post.owned === true ? <button className='post-delete-btn' onClick={(event) => this.deletePost(event, post.id)}>[delete]</button> : null}
                {post.voted == false ? this.renderLikeAndDislike(post) : null}
                {post.message}
                <div>
                Votes: {post.votes}
                </div>
            </div>
        )
    }

    postNew = (event) => {
        event.preventDefault()
        
        let post = new Post(this.messageField.value, colors[this.state.colorIndex])
        Axios.post("/posts", post).then((response) => {
            this.setState({posts: [
                response.data,
                ...this.state.posts
                
            ]})
        })
    }

    deletePost = (event, id) => {
        event.preventDefault()

        Axios.delete(`/posts/${id}`).then((response) => {
            let posts = this.state.posts.filter((value) => value.id != response.data)
            this.setState({posts: [...posts]})
        })
    }

    maxRowCheck = (event) => {
        var lineBreaks = 0
        for(let char of event.target.value){
            if(char === "\n") lineBreaks++
        }
        if(lineBreaks > 2 && event.which === 13) event.preventDefault()
        
    }

    render = () => {
        return (
            <div className='home-container'>
                <div id='newJotel' className='post-new' style={{backgroundColor: colors[this.state.colorIndex]}}>
                    <textarea onKeyPress={(event) => this.maxRowCheck(event)} ref={(ref) => this.messageField = ref} className='post-new-input'/>
                    <button onClick={(event) => this.postNew(event)} className='post-new-send'>Send</button>
                </div>
                
                {this.renderPosts()}
            </div>
        )
    }
}