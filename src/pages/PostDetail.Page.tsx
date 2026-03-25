import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, MoreHorizontal, BadgeCheck } from 'lucide-react';
import { FeedItem, SocialPostData, EditorialData, MediaCarousel, getReplies } from '../components/FeedItems.Component';
import { IconButton, PostActions } from '../components/PostActions.Component';
import { ReplyInput, DetailHeader, PageSlide, UserAvatar } from '../components/SharedUI.Component';

const ThreadPost = ({
  post,
  isMain,
  isParent,
  hasLineBelow,
  onClick,
}: {
  post: FeedItem;
  isMain?: boolean;
  isParent?: boolean;
  hasLineBelow?: boolean;
  onClick?: () => void;
}) => {
  const isSocial = post.type === 'social';
  const isEditorial = post.type === 'editorial';

  return (
    <article 
      className={`px-4 relative ${onClick ? 'cursor-pointer hover:bg-white/[0.02] transition-colors' : ''} ${isParent ? 'opacity-60 hover:opacity-100' : ''} ${isMain ? 'pt-2' : 'pt-4'}`}
      onClick={onClick}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 flex flex-col items-center">
          <UserAvatar 
            src={post.author.avatar} 
            alt={post.author.name} 
            size={isParent ? 'sm' : 'lg'}
          />
          {hasLineBelow && (
            <div className={`w-0.5 grow mt-2 -mb-4 bg-white/5 rounded-full ${isParent ? 'min-h-[20px]' : 'min-h-[40px]'}`} />
          )}
        </div>
        <div className="flex-grow pb-4">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={`${isParent ? 'text-[12px]' : 'text-[14px]'} font-bold text-on-surface`}>{post.author.name}</span>
              {post.author.verified && <BadgeCheck size={isParent ? 12 : 14} className="text-primary fill-primary" />}
              {!isParent && <span className="text-on-surface-variant text-[12px]">@{post.author.handle}</span>}
              <span className="text-on-surface-variant text-[12px]">· {post.timestamp}</span>
            </div>
            {!isParent && <IconButton icon={MoreHorizontal} />}
          </div>

          {isSocial && (
            <div className="mb-2">
              <p className={`leading-relaxed text-on-surface whitespace-pre-wrap ${isMain ? 'text-[16px]' : isParent ? 'text-[13px] line-clamp-1' : 'text-[14px]'}`}>
                {(post as SocialPostData).content}
              </p>
              {!isParent && (post as SocialPostData).images && (post as SocialPostData).images!.length > 0 && (
                <div className="-mx-4 sm:mx-0">
                  <MediaCarousel images={(post as SocialPostData).images!} aspect={isMain ? "aspect-[3/4]" : "aspect-[4/5]"} className="mt-3" />
                </div>
              )}
            </div>
          )}

          {isEditorial && !isParent && (
            <div className="mb-3">
              <div className="text-[9px] uppercase tracking-[0.2em] text-primary font-black mb-3">
                {(post as EditorialData).tag}
              </div>
              <h2 className="font-black text-xl text-on-surface leading-tight mb-3">
                {(post as EditorialData).title}
              </h2>
              <p className="text-[14px] leading-relaxed text-on-surface/80 mb-4 font-serif">
                {(post as EditorialData).excerpt}
                {isMain && (
                  <>
                    <br/><br/>
                    The evolution of digital layouts has been a fascinating journey. From the rigid table-based designs of the early web to the fluid, responsive grids we use today.
                  </>
                )}
              </p>
            </div>
          )}

          {!isParent && (
            <div className="mt-2">
              <PostActions 
                votes={post.votes} 
                replies={post.replies} 
                reposts={post.reposts} 
                shares={post.shares} 
                className="py-1"
              />
              {post.replies > 0 && !isMain && (
                <div className="flex items-center gap-1 mt-2 text-[11px] font-bold text-primary/80 hover:text-primary transition-colors">
                  <MessageCircle size={12} />
                  <span>{post.replies} {post.replies === 1 ? 'reply' : 'replies'}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export const PostDetailPage: React.FC<{ post: FeedItem; onBack: () => void; }> = ({ post, onBack }) => {
  const [replyText, setReplyText] = useState('');
  const [postStack, setPostStack] = useState<FeedItem[]>([post]);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const currentPost = postStack[postStack.length - 1];
  
  const replies = useMemo(() => getReplies(currentPost, (i, depth) => 
    depth === 0 
      ? `Interesting point! I think the ${i % 2 === 0 ? 'minimalist' : 'maximalist'} approach really shines here.`
      : `Replying to @${currentPost.author.handle}: That's a great observation about the flow.`
  ), [currentPost.id]);

  React.useEffect(() => {
    setPostStack([post]);
  }, [post]);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [currentPost.id]);

  const handleBack = () => {
    if (postStack.length > 1) {
      setPostStack(prev => prev.slice(0, -1));
    } else {
      onBack();
    }
  };

  return (
    <PageSlide>
      <DetailHeader 
        onBack={handleBack} 
        title="Thread" 
        subtitle={postStack.length > 1 ? `Replying to @${postStack[postStack.length - 2].author.handle}` : undefined} 
      />

      <div ref={scrollRef} className="flex-grow overflow-y-auto hide-scrollbar pb-24">
        <div className="pt-2">
          {postStack.slice(0, -1).map((parentPost, index) => (
            <ThreadPost key={parentPost.id} post={parentPost} isParent={true} hasLineBelow={true} onClick={() => setPostStack(prev => prev.slice(0, index + 1))} />
          ))}
        </div>
        <ThreadPost post={currentPost} isMain={true} hasLineBelow={replies.length > 0} />
        <div className="flex flex-col border-t border-white/5 mt-2">
          {replies.length > 0 ? (
            replies.map((reply, index) => (
              <ThreadPost key={reply.id} post={reply} hasLineBelow={index < replies.length - 1} onClick={() => setPostStack(prev => [...prev, reply])} />
            ))
          ) : (
            <div className="p-12 text-center"><p className="text-on-surface-variant text-sm opacity-50">No replies yet.</p></div>
          )}
        </div>
      </div>

      <ReplyInput 
        value={replyText} 
        onChange={setReplyText} 
        placeholder={`Reply to ${currentPost.author.handle}...`} 
      />
    </PageSlide>
  );
};