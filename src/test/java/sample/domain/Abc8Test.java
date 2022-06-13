package sample.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import sample.web.rest.TestUtil;

class Abc8Test {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Abc8.class);
        Abc8 abc81 = new Abc8();
        abc81.setId(1L);
        Abc8 abc82 = new Abc8();
        abc82.setId(abc81.getId());
        assertThat(abc81).isEqualTo(abc82);
        abc82.setId(2L);
        assertThat(abc81).isNotEqualTo(abc82);
        abc81.setId(null);
        assertThat(abc81).isNotEqualTo(abc82);
    }
}
