import { BeforeInsert, Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import BaseEntity from './Entity'
import Post from './Post';
import User from './User';
import Vote from './Vote';
import { Exclude, Expose } from 'class-transformer';
import { makeId } from '../utils/helpers';

@Entity("comments")
export class Comment extends BaseEntity{

    @Index()
    @Column()
    identifier:string;

    @Column()
    body:string;
    
    @Column()
    username:string;

    @ManyToOne(()=>User)
    @JoinColumn({name:"username",referencedColumnName:"username"})
    user:User

    @Column()
    postId:number;

    @ManyToOne(()=>Post,(post)=>post.comments,{nullable:false})
    post:Post

    @Exclude()
    @OneToMany(()=>Vote,(vote)=>Vote.Comments)
    votes:Vote[];

    protected userVote:number;

    setUserVote(user:User){
        const index = this.votes?.findIndex((v)=>v.username===user.username);
        this.userVote=index>-1?this.votes[index].value : 0
    }

    @Expose() get voteScore():number{
        const initalValue = 0
        return this.votes?.reduce((prev,curr) =>prev+(curr.value || 0),initalValue)
    }

    @BeforeInsert()
    makeI(){
        this.identifier = makeId(8)
    }


}
