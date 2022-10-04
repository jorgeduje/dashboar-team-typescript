
import { Drawer, Box, Typography, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { useContext } from 'react';
import { UIContext } from '../../context/ui';

const menuItems: string[] = [
    "inbox",
    "starred",
    "sendEmail",
    "Drafts"
]

export const Sidebar = () => {

    const {sidemenuOpen, closeSideMenu} = useContext( UIContext )

    return (
        <Drawer
            anchor="left"
            open={sidemenuOpen}
            onClose={closeSideMenu}
        >
            <Box sx={{ width: 250 }}>
                <Box sx={{ padding: "5px 10px" }}>
                    <Typography variant="h4">Menu</Typography>
                </Box>

                <List>
                    {
                        menuItems.map((text, index) => (
                            <ListItem button key={text}>
                                <ListItemIcon>
                                    {index % 2 ? <InboxOutlinedIcon /> : <EmailOutlinedIcon />}
                                </ListItemIcon>

                                <ListItemText primary={text} />
                            </ListItem>
                        ))
                    }
                </List>
                <Divider />
            </Box>
        </Drawer>
    )
}
