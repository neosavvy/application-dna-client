import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Avatar from "./Avatar.jsx";

export default function Account({ session }) {
    const [loading, setLoading] = useState(true)
    const [username, setUsername] = useState(null)
    const [full_name, setfull_name] = useState(null)
    const [website, setWebsite] = useState(null)
    const [avatar_url, setAvatarUrl] = useState(null)

    useEffect(() => {
        console.log("Setting up the realtime listener...")
        const profileListener = supabase
            .channel('db-profiles')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'profiles',
                },
                (payload) => {
                    console.log("payload: ",payload.new)
                    const data = payload.new
                    setUsername(data.username)
                    setfull_name(data.full_name)
                    setWebsite(data.website)
                    setAvatarUrl(data.avatar_url)
            })
            .subscribe();

        return () => {
            const unsub = profileListener.unsubscribe();
            return (...args) => {
                console.log("Unsubscribing...", args)
                unsub(args)
            }
        };
    }, []);

    useEffect(() => {
        async function getProfile() {
            setLoading(true)
            const { user } = session

            let { data, error } = await supabase
                .from('profiles')
                .select(`username, full_name, website, avatar_url`)
                .eq('id', user.id)
                .single()

            console.log("Data: ", data)

            if (error) {
                console.warn(error)
            } else if (data) {
                setUsername(data.username)
                setfull_name(data.full_name)
                setWebsite(data.website)
                setAvatarUrl(data.avatar_url)
            }

            setLoading(false)
        }

        getProfile()
    }, [session])

    async function updateProfile(event) {
        event.preventDefault()

        setLoading(true)
        const { user } = session

        const updates = {
            id: user.id,
            username,
            full_name,
            website,
            avatar_url,
            updated_at: new Date(),
        }

        let { error } = await supabase.from('profiles').upsert(updates)

        if (error) {
            alert(error.message)
        }
        setLoading(false)
    }

    return (
        <form onSubmit={updateProfile} className="form-widget">
            <Avatar
                url={avatar_url}
                size={150}
                onUpload={(event, url) => {
                    setAvatarUrl(url)
                    updateProfile(event)
                }}
            />
            <div>
                <label htmlFor="email">Email</label>
                <input id="email" type="text" value={session.user.email} disabled />
            </div>
            <div>
                <label htmlFor="username">Name</label>
                <input
                    id="username"
                    type="text"
                    required
                    value={username || ''}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="full_name">Full Name</label>
                <input
                    id="full_name"
                    type="text"
                    required
                    value={full_name || ''}
                    onChange={(e) => setfull_name(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="website">Website</label>
                <input
                    id="website"
                    type="url"
                    value={website || ''}
                    onChange={(e) => setWebsite(e.target.value)}
                />
            </div>

            <div>
                <button className="button block primary" type="submit" disabled={loading}>
                    {loading ? 'Loading ...' : 'Update'}
                </button>
            </div>

            <div>
                <button className="button block" type="button" onClick={() => supabase.auth.signOut()}>
                    Sign Out
                </button>
            </div>
        </form>
    )
}
