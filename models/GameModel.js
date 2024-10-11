// Fetch all users
export const fetchGames = async () => {
    const { data, error } = await supabase
        .from('games')
        .select('*');

    if (error) {
        console.error('Error fetching users:', error);
    } else {
        console.log('Fetched users:', data);
    }
};

// Create a game
export const createGame = async (gameId, userId) => {
    const gameObject = {
        gameId,
        board: {
            info: '1'
        },

        // creator user / current user
        player0: {
            id: userId,
            deck: [{ cardId: 'card1' }, { cardId: 'card2' }]
        },

        // joining user
        player1: {
            id: null,
            deck: [{ cardId: 'card1' }, { cardId: 'card2' }]
        }
    }

    const { data, error } = await supabase
        .from('games')
        .insert([gameObject]);

    if (error) {
        console.error('Error adding user:', error);
    } else {
        console.log('User added successfully:', data);
    }
};

// Join a game
// 

// Delete a game
export const deleteUser = async (id) => {
    const { data, error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting user:', error);
    } else {
        console.log('User deleted successfully:', data);
    }
};
